import { makeTf } from '@/content/pure';
import { CheckIcon } from '@/design/chrome/icons';
import type { ButtonRadius, ButtonShape, ButtonVariant } from '@/design/primitives/Button';
import type { Href } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { ReactNode } from 'react';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { ContactCta } from './ContactCta';

/** A resolved call to action. Labels are resolved by the page (package id or sys key). W82:
 *  `href` also accepts the typed object form of an internal `Href` (never a contact door). */
export type Cta = {
  label: string;
  href: string | Exclude<Href, string>;
  external?: boolean;
  variant?: ButtonVariant;
  /** a decorative glyph before / after the label (SHARED 5.3) */
  icon?: ReactNode;
  iconEnd?: ReactNode;
};

export type ClosingTone = 'navy' | 'gradient' | 'green' | 'light' | 'blue';

/** Per tone: the surface, the title/body/tick colours, the tick glyph's own colour, the default
 *  face of the primary and of the secondary/extra CTAs, and the default button shape.
 *  - `navy` (Homepage contact strip): the dark rounded card with the blue glow, pills.
 *  - `gradient` (SHARED 9.2 — Blog, Article): the design's 115° #16202e → #253063 band, r20, no
 *    glow, a one-line ≈ 21 px title at 1440 (`text-band`), r12 rectangles.
 *  - `green` (About, SHARED 9.4): the contrast-safe green surface (#12813c — the design's
 *    #10b981 → #059669 is 2.5:1 under white, W128b/D20), the white primary with green text, the
 *    translucent-white secondary.
 *  - `light` (SHARED 9.1 — Available Workers, Partner, Calculator): a centred full-bleed band,
 *    #f4f9fc → #e8f3f9 with a #d3e6f2 top edge, the solid green primary and the white/#bfdff0
 *    outline secondary, r11; render it OUTSIDE `.container-site` (it carries its own).
 *  - `blue` (SHARED 9.3 — Success Stories): the 135° brand gradient in its contrast-safe form
 *    (#1073a8 → #0d5f8a, D20), 1.15fr / 0.85fr, the white primary with blue text, a translucent
 *    outline secondary and the centred `link` under them.
 *  The green surface sets full-white copy and glyph (4.97:1) and `inverse-dark` (≈5.6:1) —
 *  W128(b), a D20 delta. */
const TONE: Record<
  ClosingTone,
  {
    surface: string;
    title: string;
    body: string;
    ticks: string;
    icon: string;
    primary: ButtonVariant;
    face: ButtonVariant;
    shape: ButtonShape;
    radius?: ButtonRadius;
    glow: boolean;
  }
> = {
  navy: {
    surface: 'rounded-hero bg-navy px-6 py-8 text-white lg:px-11 lg:py-10',
    title: 'text-white',
    body: 'text-white/70',
    ticks: 'text-white/75',
    icon: 'text-success',
    primary: 'primary',
    face: 'inverse',
    shape: 'pill',
    glow: true,
  },
  gradient: {
    surface:
      'rounded-lg bg-[linear-gradient(115deg,var(--color-ink),var(--color-indigo))] px-6 py-7 text-white lg:px-11 lg:py-[44px] xl:px-[33px] xl:py-[28.5px]',
    title: 'text-white',
    body: 'text-white/70',
    ticks: 'text-white/75',
    icon: 'text-success',
    primary: 'primary',
    face: 'inverse',
    shape: 'rect',
    radius: 12,
    glow: false,
  },
  green: {
    surface: 'rounded-hero bg-success-text px-6 py-8 text-white lg:px-11 lg:py-10',
    title: 'text-white',
    body: 'text-white',
    ticks: 'text-white',
    icon: 'text-white',
    primary: 'white-green',
    face: 'inverse-dark',
    shape: 'rect',
    radius: 12,
    glow: false,
  },
  light: {
    surface:
      'border-t border-edge bg-gradient-to-b from-pale-1 to-[#e8f3f9] py-16 text-center text-ink max-md:py-12',
    title: 'text-ink',
    body: 'text-text-secondary',
    ticks: 'text-text-secondary',
    icon: 'text-success-text',
    primary: 'success-solid',
    face: 'outline-blue',
    shape: 'rect',
    radius: 11,
    glow: false,
  },
  blue: {
    surface:
      'rounded-hero bg-gradient-to-br from-blue-safe to-blue-deep px-6 py-8 text-white lg:px-11 lg:py-10',
    title: 'text-white',
    body: 'text-white/85',
    ticks: 'text-white/85',
    icon: 'text-white',
    primary: 'white',
    face: 'inverse',
    shape: 'pill',
    glow: false,
  },
};

/** The title's face: the `gradient` band's one-line title, every other tone's h2. Both carry
 *  their own ≤ 700 size (QA W221 W-03 — `.ja-close h2` 25 px / 1.12 / −0.5 px); a file-level
 *  const so phone-heading-rule.test.ts reads both faces. */
const TITLE_SIZE = {
  gradient: 'text-band leading-[1.15] tracking-[-0.6px] max-md:text-[23px]',
  other: 'text-h2 max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]',
} as const;

/** The closing band every page ends on (Homepage contact strip, Blog's "let's just do it",
 *  About's green band, the light centred band, Success Stories' blue split). Pages mount the
 *  dark tones inside `<Section tone="band">`'s container, `light` full-bleed. Every CTA
 *  renders through `ContactCta` (placement `page_cta`): a contact href is tracked, any other
 *  href is a plain `Button` link. Primary and secondary/extra CTAs default to the tone's faces. */
export function ClosingCtaBand({
  bundle,
  locale,
  titleId,
  bodyId,
  primary,
  secondary,
  extra = [],
  ticks = [],
  tone = 'navy',
  id,
  shape,
  radius,
  note,
  badge,
  link,
  hideSecondaryOnPhone = false,
  hideBodyOnPhone = false,
  fullWidthOnPhone = false,
}: {
  bundle: Bundle;
  locale: Locale;
  titleId: string;
  bodyId?: string;
  primary: Cta;
  secondary?: Cta;
  /** Telegram / call — the design's third and fourth buttons. */
  extra?: Cta[];
  /** The design's phone-only tick lines (Blog band): rendered, hidden from `md` up (W10). */
  ticks?: string[];
  tone?: ClosingTone;
  id?: string;
  /** overrides the tone's button shape / radius */
  shape?: ButtonShape;
  radius?: ButtonRadius;
  /** a small line under the buttons (the light band's licence line) */
  note?: string;
  /** a centred green pill above the title on phones (Partner M9: "4 iş saati içinde…") */
  badge?: string;
  /** the `blue` split's centred text link under the buttons ("Ya da maliyeti … →") */
  link?: { label: string; href: string | Exclude<Href, string> };
  /** phones: hide the secondary and extra CTAs (Blog/Article: WhatsApp hidden) */
  hideSecondaryOnPhone?: boolean;
  /** phones: hide the body copy (About) */
  hideBodyOnPhone?: boolean;
  /** phones: full-width stacked buttons (light band, About, Blog primary 54 px) */
  fullWidthOnPhone?: boolean;
}) {
  const t = makeTf(bundle, locale);
  const look = TONE[tone];
  const btnShape = shape ?? look.shape;
  const btnRadius = radius ?? look.radius;
  const phoneWide = fullWidthOnPhone ? 'max-md:w-full max-md:min-h-[54px]' : undefined;
  const cta = (c: Cta, fallback: ButtonVariant, key: string, secondaryRow: boolean) => (
    <ContactCta
      key={key}
      placement="page_cta"
      variant={c.variant ?? fallback}
      href={c.href}
      external={c.external}
      prefetch={false}
      shape={btnShape}
      radius={btnRadius}
      icon={c.icon}
      iconEnd={c.iconEnd}
      className={
        [phoneWide, secondaryRow && hideSecondaryOnPhone ? 'max-md:hidden' : null]
          .filter(Boolean)
          .join(' ') || undefined
      }
    >
      {c.label}
    </ContactCta>
  );
  const centered = tone === 'light';
  const split = tone === 'blue';
  const actions = (
    <div
      className={[
        'flex flex-wrap gap-3',
        centered ? 'justify-center' : null,
        split ? 'flex-col items-stretch' : null,
        fullWidthOnPhone ? 'max-md:flex-col max-md:items-stretch' : null,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {cta(primary, look.primary, 'primary', false)}
      {secondary && cta(secondary, look.face, 'secondary', true)}
      {extra.map((c, i) => cta(c, look.face, `extra-${i}`, true))}
      {link && (
        <Link
          href={link.href as Href}
          prefetch={false}
          className="mt-1 text-center text-body-sm font-extrabold text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
  const copy = (
    // SHARED 10.2: the gradient band caps its lede, not its title (one line at 1440)
    <div
      className={
        centered
          ? 'mx-auto max-w-[600px]'
          : tone === 'gradient'
            ? 'min-w-0 flex-1'
            : 'max-w-[600px]'
      }
    >
      {badge && (
        <p
          className={`m-0 mb-3 inline-flex items-center gap-2 rounded-pill border border-success-soft-border bg-success-soft px-3.5 py-1.5 text-[12.5px] font-extrabold text-success-text md:hidden`}
        >
          <span aria-hidden="true" className="ja-live h-2 w-2 rounded-pill bg-success" />
          {badge}
        </p>
      )}
      {/* QA W221 W-03: the design's `.ja-close h2` ≤ 700 is 25 px / 1.12 / −0.5 px on every
          page's closing band — the block's own phone face (W217; phone-heading-rule.test.ts
          sweeps this module like a route); the `gradient` band's one-line title is smaller. */}
      <h2
        className={`m-0 mb-2 ${TITLE_SIZE[tone === 'gradient' ? 'gradient' : 'other']} ${look.title} xl:text-balance`}
      >
        {t(titleId)}
      </h2>
      {bodyId && (
        <p
          className={`text-body m-0 max-w-[600px] ${look.body}${hideBodyOnPhone ? ' max-md:hidden' : ''}`}
        >
          {t(bodyId)}
        </p>
      )}
      {ticks.length > 0 && (
        <ul
          className={`text-body-sm m-0 mt-4 flex list-none flex-col gap-2 p-0 ${look.ticks} md:hidden`}
        >
          {ticks.map((tick) => (
            <li key={tick} className="flex items-start gap-2">
              <CheckIcon className={`mt-0.5 shrink-0 ${look.icon}`} />
              {tick}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  if (centered) {
    return (
      <div id={id} data-tone={tone} className={look.surface}>
        <div className="container-site flex flex-col items-center gap-7">
          {copy}
          {actions}
          {note && (
            <p className="m-0 text-[12.5px] font-bold text-text-tertiary xl:text-[11px]">{note}</p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div id={id} data-tone={tone} className={`relative overflow-hidden ${look.surface}`}>
      {look.glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-40 h-[480px] w-[480px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.24),transparent_65%)]"
        />
      )}
      <div
        className={
          split
            ? 'relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]'
            : 'relative flex flex-wrap items-center justify-between gap-8'
        }
      >
        {copy}
        {actions}
        {note && <p className="m-0 w-full text-body-sm text-white/60">{note}</p>}
      </div>
    </div>
  );
}
