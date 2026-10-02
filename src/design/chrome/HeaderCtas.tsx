'use client';
import { Link, usePathname } from '@/i18n/navigation';
import { buttonClassName } from '@/design/primitives/Button';
import { ctasFor, type CtaTable, type ResolvedCta } from './ctas';

// The header's primary face is the `nav` variant — ink at rest, blue-safe on hover (the design's
// nav CTA, W155) — never `primary` plus appended colour classes, which Tailwind resolves by
// alphabetical order, not by position (W122: the blue hover never rendered). The danger face is
// the red "Report an Impostor"; both keep Button's base/size/focus classes.
/** ≤ 460 (the design's `.ja-nav-cta` rule, W190 A3 / W210 b): the CTA flexes into the width the
 *  fixed wordmark leaves, caps at 185 px, pads 10 px and lets its label wrap — `max-xs:` twins of
 *  different properties, so nothing collides with the base `whitespace-nowrap` (W122). */
export const PHONE_CTA =
  'whitespace-nowrap max-xs:max-w-[185px] max-xs:flex-auto max-xs:whitespace-normal max-xs:px-2.5';
const PRIMARY = buttonClassName('nav', 'md', PHONE_CTA);
const DANGER = buttonClassName('danger', 'md', PHONE_CTA);
// `xl`-only, like the design's `.ja-nav-cta-secondary` (hidden ≤1100) — `max-xl:hidden` sorts
// after `buttonClassName`'s base `inline-flex`, so the media variant wins the cascade; a bare
// `hidden` (as WP1's <Button> used) loses to that same base class and never hides anything
// (W119; `src/design/chrome/__tests__/visibility.test.tsx` guards this element).
const SECONDARY = buttonClassName('secondary', 'md', 'max-xl:hidden whitespace-nowrap');

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
