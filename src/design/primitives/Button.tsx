import type { HTMLAttributes, ReactNode } from 'react';
import { Link, type Href } from '@/i18n/navigation';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-blue text-white hover:bg-blue-safe',
  secondary: 'border border-border-1 bg-white text-ink hover:border-tint-border hover:bg-pale-1',
  ghost: 'text-blue-safe hover:bg-tint',
  danger: 'bg-danger text-white hover:opacity-90',
};

const SIZE = {
  md: 'min-h-[44px] px-5 text-body-sm',
  lg: 'min-h-[52px] px-7 text-body',
} as const;

// 44 px minimum target and a visible focus ring on every branch (D20).
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-pill text-center font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe disabled:cursor-not-allowed disabled:opacity-60';

export type ButtonProps = {
  variant: ButtonVariant;
  size?: 'md' | 'lg';
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Button({
  variant,
  size = 'md',
  href,
  external,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = [BASE, VARIANT[variant], SIZE[size], className].filter(Boolean).join(' ');
  if (href && external) {
    return (
      <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  if (href && href.startsWith('/')) {
    return (
      // R17: `href` is a plain string at this component's boundary; next-intl's typed
      // pathnames are re-imposed here. The one sanctioned cast in this module.
      <Link {...rest} href={href as Href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button {...rest} type={type} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
