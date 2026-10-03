import { useTranslations } from 'next-intl';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button } from '@/design/primitives/Button';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { EligibilityWizard } from '../_components/EligibilityWizard';
import { CheckIcon, ClockIcon, DocIcon, UsersIcon } from '../_components/icons';
import { HERO_SIZE, HERO_SRC } from '../_lib/assets';
import type { WizardProps } from '../_lib/eligibility';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { HERO_BENEFITS, HERO_CHIPS, type ChipIcon } from '../_lib/tables';

const CHIP: Record<ChipIcon, { Icon: typeof ClockIcon; tone: string }> = {
  clock: { Icon: ClockIcon, tone: 'text-blue-safe' },
  doc: { Icon: DocIcon, tone: 'text-success-text' },
  users: { Icon: UsersIcon, tone: 'text-[#253063]' },
};

/** The navy hero: crumbs + the D17 badge, the h1 (the LCP element while `wp-hero` is a
 *  placeholder, D26), the W10 intro and legal variants, three benefits, the CTA row (hidden
 *  ≤ 700 px as designed — the chrome's mobile bottom bar carries Call/WhatsApp there), the
 *  eligibility wizard as the right column, and the stat chips (delta 2: three, not four). */
export function Hero({
  bundle,
  locale,
  tf,
  badge,
  wizard,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** `heroBadge(rateConfig, locale, sys)` — `null` from `reviewDueAt` on (D17/W150). */
  badge: string | null;
  wizard: WizardProps;
}) {
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const heroIsLcp = HERO_SRC !== null;
  const [h1a, h1b] = [tf('wp.023'), tf('wp.024')];
  const [mobA, mobB] = [tf('wp.026'), tf('wp.027')];
  return (
    <section data-testid="wp-hero" className="relative overflow-hidden bg-navy text-white">
      {/* D26 + W129: the named hero slot. ImageSlot owns its box (full width at 16:9 —
          HERO_SIZE), so the cover crop is this wrapper's job, clipped by the section. W187: the
          box never follows the text's height (a wrapper sized `h-full` or centred on a
          text-driven hero moves and resizes when the h1 rewraps) — it is anchored top-left at
          a fixed height per breakpoint, each above the tallest hero in its range (the stacked
          wizard below 901 px, two columns from 901). With a photo (HERO_SRC) the image becomes
          the LCP element (`data-lcp-slot="wp-hero"` + preload; W189 A5's cover-mode slot
          first); without one it is a decorative named placeholder and the h1 carries the
          slot. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 aspect-[16/9] h-[2000px] min-w-full md:h-[1800px] lg:h-[1200px]">
          <ImageSlot
            slot="wp-hero"
            lcp={heroIsLcp}
            src={HERO_SRC}
            alt=""
            width={HERO_SIZE.width}
            height={HERO_SIZE.height}
            sizes="100vw"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70"
      />
      <div className="container-site relative py-16 max-md:pt-8 max-md:pb-10">
        <div className="grid items-center gap-10 max-md:gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-x-3.5 gap-y-2">
              {/* W109: this page's own labels — wp.021 (Home), wp.011 (Work Permits) */}
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: tf('wp.021'), href: '/' },
                  { name: tf('wp.011'), href: '/work-permit' },
                ]}
              />
              {badge ? (
                <p
                  data-testid="wp-updated"
                  className="m-0 inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-white/10 px-3 py-1 text-eyebrow font-extrabold text-white/85"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 flex-none rounded-pill bg-success"
                  />
                  {badge}
                </p>
              ) : null}
            </div>
            <h1
              data-testid="page-h1"
              data-lcp-slot={heroIsLcp ? undefined : 'h1'}
              className="m-0 mb-4 text-h1 leading-[1.03] tracking-[-0.03em] max-md:mb-3 max-md:text-[30px] max-md:leading-[1.08]"
            >
              {h1a}
              {sp(h1a, h1b)}
              <span className="text-sky">{h1b}</span>
            </h1>
            {/* W10: the design's ≤ 700 px copy variants — both server-rendered, CSS-switched. */}
            <p className="m-0 mb-5 max-w-[520px] text-body-lg text-white/75 max-md:mb-4">
              <span data-testid="wp-intro-desk" className="max-md:hidden">
                {tf('wp.025')}
              </span>
              <span data-testid="wp-intro-mob" className="md:hidden">
                {mobA}
                {sp(mobA, mobB)}
                <strong className="font-extrabold text-white">{mobB}</strong>.
              </span>
            </p>
            <ul className="mb-5 flex max-w-[540px] flex-col gap-2 max-md:mb-4 max-md:rounded-sm max-md:border max-md:border-white/20 max-md:bg-white/10 max-md:p-3.5">
              {HERO_BENEFITS.map(([strongId, restId]) => {
                const [a, b] = [tf(strongId), tf(restId)];
                return (
                  <li
                    key={strongId}
                    className="flex items-start gap-2.5 text-body text-white/75 max-md:text-body-sm"
                  >
                    <CheckIcon size={15} className="mt-1 flex-none text-success-border" />
                    <span>
                      <strong className="font-extrabold text-white">{a}</strong>
                      {sp(a, b)}
                      {b}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div data-testid="wp-hero-ctas" className="mb-5 flex flex-wrap gap-3 max-md:hidden">
              <Button variant="primary" size="lg" href="#eligibility">
                {tf('wp.034')}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="success"
                size="lg"
                external
                href={waLink(s.whatsappNumber, waPrefill(sys, 'question'))}
              >
                {tf('wp.035')}
              </ContactCta>
            </div>
            <p className="m-0 max-w-[480px] text-body-sm text-muted max-md:text-white/60">
              <span className="max-md:hidden">{tf('wp.036')}</span>
              <span className="md:hidden">{tf('wp.037')}</span>
            </p>
          </div>
          <div className="min-w-0">
            <EligibilityWizard {...wizard} />
          </div>
        </div>
        <ul
          data-testid="wp-chips"
          className="mt-9 grid grid-cols-2 gap-3.5 max-md:mt-5 max-md:gap-2 lg:grid-cols-3"
        >
          {HERO_CHIPS.map((c) => {
            const { Icon, tone } = CHIP[c.icon];
            const [a, b] = [tf(c.strongId), tf(c.restId)];
            return (
              <li
                key={c.strongId}
                className="flex items-center gap-3 rounded-sm border border-tint-border bg-white px-4 py-3 text-body-sm text-text-secondary max-md:gap-2.5 max-md:px-3 max-md:py-2.5"
              >
                <Icon size={18} className={`flex-none ${tone}`} />
                <span>
                  <strong className="font-extrabold text-ink">{a}</strong>
                  {sp(a, b)}
                  {b}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
