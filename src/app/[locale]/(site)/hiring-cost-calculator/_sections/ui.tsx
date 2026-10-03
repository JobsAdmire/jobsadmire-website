import { Fragment, type ReactNode } from 'react';

/*
 * Page-local presentational pieces the server sections share (no directive, no hooks). Class
 * strings obey W119/W122/W155 (one utility per property per variant on every composed string);
 * greys follow D20 — `text-text-secondary` on `pale-1`, `text-text-tertiary` only on
 * white/`pale-2`/`pale-3`; the design's #94a3b8 kickers become `text-text-tertiary`.
 */

const HEAD = {
  center: 'mx-auto mb-10 max-w-[680px] text-center max-md:sr-only xl:mb-[30px] xl:max-w-[510px]',
  left: 'mb-2.5 max-w-[640px] max-md:sr-only xl:max-w-[480px]',
} as const;
const H2 = {
  lg: 'm-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.04em] text-ink',
  sm: 'm-0 mb-2.5 text-[clamp(22px,2.4vw,28px)] leading-[1.15] tracking-[-0.035em] text-ink xl:text-[clamp(16.5px,1.8vw,21px)]',
} as const;

export type SectionHeadProps = {
  title: string;
  sub: string;
  align?: keyof typeof HEAD;
  size?: keyof typeof H2;
};

/** A section's h2 + subtitle. Visible from 701 px; ≤ 700 px the trigger shows the section's
 *  short title instead and this pair stays in the accessibility tree (`max-md:sr-only`, W10). */
export function SectionHead({ title, sub, align = 'center', size = 'lg' }: SectionHeadProps) {
  return (
    <div className={HEAD[align]}>
      <h2 className={H2[size]}>{title}</h2>
      <p className="m-0 text-body-lg text-text-secondary">{sub}</p>
    </div>
  );
}

/** Small upper-case labels: white/pale-2/pale-3 cards, pale-1 cards, navy cards. */
export const KICKER =
  'm-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] text-text-tertiary';
export const KICKER_SM =
  'm-0 mb-2 text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-text-tertiary';
export const KICKER_SM_PALE =
  'm-0 mb-2 text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-text-secondary';
export const KICKER_DARK =
  'm-0 mb-1.5 text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-sky';

const NOTE = {
  amber:
    'm-0 rounded-sm border border-warning-border bg-warning-surface px-[22px] xl:px-[16.5px] py-4 text-body-sm leading-[1.6] text-[#7a5210] max-md:px-3.5 max-md:py-[13px]',
  green:
    'm-0 rounded-base border border-success-border bg-success-surface px-[26px] xl:px-[19.5px] py-5 text-body leading-[1.65] text-[#14532d] max-md:px-3.5 max-md:py-[13px] max-md:text-body-sm',
} as const;

/** The design's amber/green notes. `className` is for margins and visibility only (W122). */
export function Note({
  tone,
  className,
  children,
}: {
  tone: keyof typeof NOTE;
  className?: string;
  children: ReactNode;
}) {
  return <p className={[NOTE[tone], className].filter(Boolean).join(' ')}>{children}</p>;
}

const TICK =
  'mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] border border-success-border bg-success-surface text-[12px] xl:text-[11px] font-extrabold text-success-text';
const TICK_DARK =
  'mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] border border-[rgba(93,223,176,0.4)] bg-[rgba(93,223,176,0.16)] text-[12px] xl:text-[11px] font-extrabold text-[#5ddfb0]';

/** The design's check square (decorative — the row's text carries the meaning). */
export function Tick({ dark = false }: { dark?: boolean }) {
  return (
    <span aria-hidden="true" className={dark ? TICK_DARK : TICK}>
      ✓
    </span>
  );
}

const DOT = {
  blue: 'mt-[7px] xl:mt-[5.25px] h-[7px] w-[7px] shrink-0 rounded-pill bg-blue',
  amber: 'mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-warning',
  green: 'mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-success',
} as const;

/** A bullet as a shape, never a glyph (no text to fail a contrast audit). */
export function Dot({ tone }: { tone: keyof typeof DOT }) {
  return <span aria-hidden="true" className={DOT[tone]} />;
}

/** calc.124/125 carry the package's own `<br />` — rendered as line breaks, never as markup. */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split(/<br\s*\/?>/).map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}
