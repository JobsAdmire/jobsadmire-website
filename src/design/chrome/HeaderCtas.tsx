'use client';
import { Link, usePathname } from '@/i18n/navigation';
import { buttonClassName } from '@/design/primitives';
import { ctasFor, type CtaTable, type ResolvedCta } from './ctas';

// The header's primary face is ink with a blue hover (the design's nav CTA), the danger face
// is the red "Report an Impostor"; both keep Button's base/size/focus classes.
const PRIMARY = buttonClassName('primary', 'md', 'whitespace-nowrap bg-ink hover:bg-blue-safe');
const DANGER = buttonClassName('danger', 'md', 'whitespace-nowrap');
// `xl`-only, like the design's `.ja-nav-cta-secondary` (hidden ≤1100) — the same
// `hidden … xl:inline-flex` pair the WP1 header used on <Button>, proven by the gate at 1100
const SECONDARY = buttonClassName('secondary', 'md', 'hidden whitespace-nowrap xl:inline-flex');

function Primary({ cta }: { cta: ResolvedCta }) {
  return (
    <Link href={cta.href} prefetch={false} className={cta.variant === 'danger' ? DANGER : PRIMARY}>
      {cta.label}
      {/* the long form only from xl, like the design's `.ja-cta-long` */}
      {cta.tail && (
        <>
          {' '}
          <span className="hidden xl:inline">{cta.tail}</span>
        </>
      )}
    </Link>
  );
}

/** W17: picks the page's CTAs by next-intl's internal pathname — the same value on the server
 *  and in the browser, so the SSR markup never differs from hydration. Outside the App Router
 *  (unit tests) the pathname is `null` and the defaults render. Every href in the table is an
 *  internal `Href`, so nothing here is a contact link (placement `header` stays reserved). */
export function HeaderCtas({ table }: { table: CtaTable }) {
  const { primary, secondary } = ctasFor(table, usePathname());
  return (
    <>
      {secondary && (
        <Link href={secondary.href} prefetch={false} className={SECONDARY}>
          {secondary.label}
        </Link>
      )}
      <Primary cta={primary} />
    </>
  );
}
