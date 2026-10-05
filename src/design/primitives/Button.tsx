import type { HTMLAttributes, ReactNode } from 'react';
import { Link, type Href } from '@/i18n/navigation';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'inverse'
  | 'success'
  | 'success-solid'
  | 'inverse-dark'
  | 'nav'
  | 'tint'
  | 'outline-blue'
  | 'outline-green'
  | 'white'
  | 'white-green'
  | 'gradient';

const VARIANT: Record<ButtonVariant, string> = {
  // D20: white on the raw brand blue (#1899d5) is 3.2:1 — enough for large text, not for
  // a 15 px button label. The contrast-safe blue is the CTA face; `blue` survives as a
  // decorative/hover surface behind icons only. Parity pass (SHARED 5.4): the design darkens
  // its primary on hover (#1899D5 → #1385bd); ours darkens the safe blue the same way.
  primary: 'bg-blue-safe text-white hover:bg-blue-deep',
  secondary: 'border border-border-1 bg-white text-ink hover:border-tint-border hover:bg-pale-1',
  ghost: 'text-blue-safe hover:bg-tint',
  danger: 'bg-danger text-white hover:opacity-90',
  // The design's translucent white outline on navy/gradient bands (ClosingCtaBand's
  // WhatsApp/Telegram/call buttons): white text on navy is 15:1, the face only frames it.
  inverse: 'border border-white/30 bg-white/10 text-white hover:bg-white/20',
  // W127 / SHARED 5.2a: the design's pale green WhatsApp face (#eafaf1 fill, 1.5 px #bfe8cf edge,
  // #12813c text — 4.6:1). A variant, never caller colour classes: Tailwind orders rules by name,
  // not by class-string position (W122).
  success:
    'border-[1.5px] border-success-soft-border bg-success-soft text-success-text hover:bg-success-surface',
  // SHARED 5.2b: the design's SOLID WhatsApp green (#16a34a, white text) is 3.3:1 — the face is
  // the contrast-safe green the mobile bar already wears (#12813c, 4.96:1), darker on hover, with
  // the design's green shadow.
  'success-solid':
    'bg-success-text text-white shadow-[0_8px_20px_rgba(22,163,74,0.28)] hover:bg-success-deep',
  // W128(b): the green band's face (ClosingCtaBand tone="green", #12813c). White on the
  // darkened surface is ≈5.6:1; `inverse`'s white/10 lightens it to 4.13:1 (a D20 delta).
  'inverse-dark': 'border border-white/40 bg-black/15 text-white hover:bg-black/25',
  // W155: the design's nav CTA — ink at rest, blue on hover, in the contrast-safe blue every CTA
  // face uses (a D20 delta entry). The header used to append `bg-ink hover:bg-blue-safe` to
  // `primary`, whose own `hover:bg-ink` won by Tailwind's alphabetical order (W122).
  nav: 'bg-ink text-white hover:bg-blue-safe',
  // SHARED 2.3: the design's tinted secondary (header "İş Ortağı Olun": #e8f4fb fill, 1.5 px
  // #bfdff0 edge, #1073a8 text; hover #d3ecf9 / #1899D5 edge).
  tint: 'border-[1.5px] border-tint-border bg-tint text-blue-safe hover:border-blue hover:bg-tint-hover',
  // SHARED 7.1 / 9.1: the design's white faces with a coloured edge on light surfaces — the
  // sticky bar's "Arayın" (#bfdff0 edge, #1073a8 text) and WhatsApp (#bfe8cf edge, green text).
  'outline-blue':
    'border-[1.5px] border-tint-border bg-white text-blue-safe hover:border-blue hover:bg-tint',
  'outline-green':
    'border-[1.5px] border-success-soft-border bg-white text-success-text hover:bg-success-soft',
  // SHARED 9.3 / 9.4: the white primary on a blue or green band (#1073a8 / green text).
  white: 'bg-white text-blue-safe hover:bg-pale-1',
  'white-green': 'bg-white text-success-text hover:bg-success-soft',
  // SHARED 2.5 / 5.5: the design's 135° brand gradient (#1899D5 → #1073a8) is 3.2:1 at its light
  // end — the contrast-safe gradient #1073a8 → #0d5f8a keeps white text ≥ 5.3:1.
  gradient:
    'bg-gradient-to-br from-blue-safe to-blue-deep text-white shadow-[0_8px_20px_rgba(24,153,213,0.32)] hover:from-blue-deep hover:to-blue-deep',
};

const SIZE = {
  md: 'min-h-[44px] px-5 text-body-sm',
  lg: 'min-h-[52px] px-7 text-body',
} as const;

/** SHARED 5.1: outside the heroes and the mobile bar the design's CTAs are rectangles of 9–14 px
 *  radius (r9 article sticky; r10 sticky bar, ask card, partner; r11 calc, closing bands, verify
 *  lookup; r12 verify hero, blog CTA, about band; r13 join hero; r14 the full-width phone CTAs). */
export type ButtonRadius = 9 | 10 | 11 | 12 | 13 | 14;
const RADIUS: Record<ButtonRadius, string> = {
  9: 'rounded-[9px]',
  10: 'rounded-[10px]',
  11: 'rounded-[11px]',
  12: 'rounded-[12px]',
  13: 'rounded-[13px]',
  14: 'rounded-[14px]',
};
export type ButtonShape = 'pill' | 'rect';

// 44 px minimum target and a visible focus ring on every branch (D20). `ja-hover-lift`
// (src/design/motion/motion.css) is the design's `.ja-btn-l`: a 2 px lift on hover, a press on
// :active, nothing under reduced motion.
const BASE =
  'inline-flex items-center justify-center gap-2 text-center font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe disabled:cursor-not-allowed disabled:opacity-60';

export type ButtonLook = {
  shape?: ButtonShape;
  /** the rectangle's radius (default 10); ignored for pills */
  radius?: ButtonRadius;
  /** the design's hover lift (default on) */
  lift?: boolean;
};

/** The exact class string `<Button>` renders, for the one caller that cannot go through it:
 *  a next-intl `Link` with an *object* href (`{ pathname, hash }`), which `Button`'s
 *  string-only `href` (R17) cannot carry. Same face, same focus ring, same hit target. */
export function buttonClassName(
  variant: ButtonVariant,
  size: 'md' | 'lg' = 'md',
  className?: string,
  look: ButtonLook = {},
): string {
  const { shape = 'pill', radius = 10, lift = true } = look;
  return [
    BASE,
    shape === 'pill' ? 'rounded-pill' : RADIUS[radius],
    lift ? 'ja-hover-lift' : null,
    VARIANT[variant],
    SIZE[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/** The label with its optional glyphs: a leading icon (WhatsApp, phone, printer, pin) and a
 *  trailing one (→). Icons are decorative — the label stays the accessible name. */
export function withIcons(children: ReactNode, icon?: ReactNode, iconEnd?: ReactNode): ReactNode {
  if (!icon && !iconEnd) return children;
  return (
    <>
      {icon}
      {children}
      {iconEnd}
    </>
  );
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
  /** `pill` (default: heroes, header, mobile bar) or `rect` with `radius` (SHARED 5.1) */
  shape?: ButtonShape;
  radius?: ButtonRadius;
  /** the design's hover lift (`.ja-btn-l`); default on */
  lift?: boolean;
  /** a decorative glyph before the label (SHARED 5.3) */
  icon?: ReactNode;
  /** a decorative glyph after the label — the design's trailing → */
  iconEnd?: ReactNode;
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
  shape,
  radius,
  lift,
  icon,
  iconEnd,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = buttonClassName(variant, size, className, { shape, radius, lift });
  const body = withIcons(children, icon, iconEnd);
  // A disabled CTA must never navigate, whatever its href says.
  if (disabled || !href) {
    return (
      <button {...rest} type={type} disabled={disabled} className={cls}>
        {body}
      </button>
    );
  }
  if (external) {
    return (
      <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      // R17: `href` is a plain string at this component's boundary; next-intl's typed
      // pathnames are re-imposed here. The one sanctioned cast in this module.
      <Link {...rest} href={href as Href} prefetch={prefetch} className={cls}>
        {body}
      </Link>
    );
  }
  // R22: anything else that is still a link — `https://wa.me/…`, `tel:`, `mailto:` — stays a
  // same-tab anchor rather than degrading into a button that goes nowhere.
  return (
    <a {...rest} href={href} className={cls}>
      {body}
    </a>
  );
}
