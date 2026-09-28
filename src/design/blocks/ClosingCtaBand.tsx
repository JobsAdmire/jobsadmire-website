import { makeTf } from '@/content/pure';
import { CheckIcon } from '@/design/chrome/icons';
import type { ButtonVariant } from '@/design/primitives/Button';
import type { Href } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { ContactCta } from './ContactCta';

/** A resolved call to action. Labels are resolved by the page (package id or sys key). W82:
 *  `href` also accepts the typed object form of an internal `Href` (never a contact door). */
export type Cta = {
  label: string;
  href: string | Exclude<Href, string>;
  external?: boolean;
  variant?: ButtonVariant;
};

/** Per tone: the surface, the body/tick copy colour, the tick glyph's own colour and the
 *  default face of the secondary/extra CTAs. The green surface (#12813c) is too light for the
 *  navy tones' softened white, their `text-success` glyph (1.51:1 — N1) and their
 *  translucent-white `inverse` face, so it sets full-white copy and glyph (4.97:1) and
 *  `inverse-dark` (≈5.6:1) — W128(b), a D20 delta. */
const TONE: Record<
  'navy' | 'gradient' | 'green',
  { surface: string; body: string; ticks: string; icon: string; face: ButtonVariant }
> = {
  navy: {
    surface: 'bg-navy',
    body: 'text-white/70',
    ticks: 'text-white/75',
    icon: 'text-success',
    face: 'inverse',
  },
  gradient: {
    surface: 'bg-gradient-to-br from-ink to-navy',
    body: 'text-white/70',
    ticks: 'text-white/75',
    icon: 'text-success',
    face: 'inverse',
  },
  green: {
    surface: 'bg-success-text',
    body: 'text-white',
    ticks: 'text-white',
    icon: 'text-white',
    face: 'inverse-dark',
  },
};

/** The closing band every page ends on (Homepage contact strip, Blog's "let's just do it",
 *  About's green band): a dark rounded card with h2 + body, the primary CTA and the
 *  WhatsApp/Telegram/call buttons. Pages mount it inside `<Section tone="band">`. Every CTA
 *  renders through `ContactCta` (placement `page_cta`): a contact href is tracked, any
 *  other href is a plain `Button` link. Secondary/extra CTAs default to the tone's face —
 *  `inverse` on navy/gradient, `inverse-dark` on green (W128b). */
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
  tone?: keyof typeof TONE;
  id?: string;
}) {
  const t = makeTf(bundle, locale);
  const look = TONE[tone];
  const cta = (c: Cta, fallback: ButtonVariant, key: string) => (
    <ContactCta
      key={key}
      placement="page_cta"
      variant={c.variant ?? fallback}
      href={c.href}
      external={c.external}
    >
      {c.label}
    </ContactCta>
  );
  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-hero px-6 py-8 text-white lg:px-11 lg:py-10 ${look.surface}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-40 h-[480px] w-[480px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.24),transparent_65%)]"
      />
      <div className="relative flex flex-wrap items-center justify-between gap-8">
        <div className="max-w-[600px]">
          <h2 className="text-h2 m-0 mb-2 text-white">{t(titleId)}</h2>
          {bodyId && <p className={`text-body m-0 ${look.body}`}>{t(bodyId)}</p>}
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
        <div className="flex flex-wrap gap-3">
          {cta(primary, 'primary', 'primary')}
          {secondary && cta(secondary, look.face, 'secondary')}
          {extra.map((c, i) => cta(c, look.face, `extra-${i}`))}
        </div>
      </div>
    </div>
  );
}
