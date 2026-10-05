import { useTranslations } from 'next-intl';
import type { SourceCountry } from '@/content/collections';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ArrowRightIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { HeroRoleCard } from '../_components/HeroRoleCard';
import { MapPinIcon } from '../_components/icons';
import type { RoleCard, Tf } from '../_lib/roles';

/** The design's navy gradient (`.ja-jt-hero`); ≤ 900 px a solid #0a1428 (l. 295). */
const HERO_BG =
  'bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)] max-lg:bg-night max-lg:bg-none';
const TRUST = ['jt.027', 'jt.028', 'jt.029'] as const;

function Tick() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none text-[#4ade80] max-lg:text-sky"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * The dark text-only hero: the breadcrumb (this page's own ids, W109), the live-count pill
 * (W1 — counted from the list; absent when nothing is open, W6), the h1 (the named LCP element,
 * D26 — no image slot on this page), "See N open positions" + "Send an open application", the
 * trust chips, the overseas role card and the source-country strip (the ONE list, D17). Small
 * greys are #a9b5d8 (the design's #8b98c4 is 4.4:1 on #253063 — D20).
 *
 * Parity (S2.1–S2.4, M2–M6): the two radial glows and the 26 px dot grid (ll. 568–570; one
 * smaller glow on a solid #0a1428 ≤ 900 px), 13 px rectangles from 901 px (pills below, full
 * width ≤ 700 px) with the primary's →, the primary counting the OVERSEAS roles and
 * pre-filtering the list to them (`data-roles-place`, read by `RolesList`), the pin before
 * "Countries we work in", chips without flags, and ≤ 900 px the chips as ONE horizontally
 * scrolling row bleeding into the gutters. The bleed stays inside the section's
 * `overflow-hidden` (no document overflow), the row is a focusable scroll region, and both the
 * row and its chips wear opaque faces so axe reads their real background (QA W220 CAR-01).
 */
export function CareersHero({
  t,
  locale,
  openingsCount,
  overseasCount = 0,
  heroCards,
  sourceCountries,
}: {
  t: Tf;
  locale: Locale;
  openingsCount: number;
  overseasCount?: number;
  heroCards: RoleCard[];
  sourceCountries: SourceCountry[];
}) {
  const sys = useTranslations('sys');
  const seeCount = overseasCount > 0 ? overseasCount : openingsCount;
  return (
    <Section tone="dark" className={`relative overflow-hidden pt-8 pb-0 max-lg:pt-6 ${HERO_BG}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[180px] -right-[120px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(24,153,213,0.34)_0%,rgba(24,153,213,0)_68%)] max-lg:-top-[140px] max-lg:h-[320px] max-lg:w-[320px] max-lg:bg-[radial-gradient(circle,rgba(24,153,213,0.22)_0%,rgba(24,153,213,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[220px] -left-[160px] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(127,208,245,0.16)_0%,rgba(127,208,245,0)_70%)] max-lg:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.13] max-lg:hidden"
      />
      <div className="container-site relative">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('jt.021'), href: '/' },
            { name: t('jt.005'), href: '/careers' },
          ]}
        />
        <div className="grid items-center gap-8 pt-6 pb-10 max-lg:gap-[26px] max-lg:pt-3.5 max-lg:pb-[30px] lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
          {/* the design's `.ja-up`: the copy column rises in */}
          <div className="ja-up min-w-0">
            {openingsCount > 0 && (
              <p
                data-testid="careers-hiring-count"
                className="mb-5 inline-flex items-center gap-2 rounded-pill border border-[#4ade80]/40 bg-[#16a34a]/15 px-4 py-1.5 text-body-sm font-extrabold text-[#86efac] max-lg:mb-4 max-lg:border-white/28 max-lg:bg-transparent max-lg:text-[11.5px] max-lg:font-bold max-lg:tracking-[0.7px] max-lg:text-white max-lg:uppercase"
              >
                <span
                  aria-hidden="true"
                  className="ja-live ja-live-soft h-2 w-2 rounded-pill bg-[#4ade80]"
                />
                {sys('careers.hero.hiringCount', { count: openingsCount })}
              </p>
            )}
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="text-h1 leading-[1.02] tracking-[-0.03em] text-white max-md:text-[38px] max-md:tracking-[-1.5px]"
            >
              {t('jt.022')}
              <br />
              <span className="text-sky">{t('jt.023')}</span>
            </h1>
            <p
              data-testid="careers-hero-lead"
              className="mt-5 max-w-[520px] text-body-lg text-[#c1cbe6]"
            >
              {t('jt.024')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3 max-md:flex-col max-md:gap-2.5">
              <a
                href="#roles"
                data-roles-place={overseasCount > 0 ? 'overseas' : undefined}
                className={buttonClassName(
                  'primary',
                  'lg',
                  'ja-hover-card max-lg:min-h-[54px] max-lg:rounded-pill max-md:w-full',
                  { shape: 'rect', radius: 13, lift: false },
                )}
              >
                {sys('careers.hero.seeOpenings', { count: seeCount })}
                <ArrowRightIcon size={16} />
              </a>
              <a
                href="#apply"
                className={buttonClassName(
                  'inverse',
                  'lg',
                  'max-lg:min-h-[54px] max-lg:rounded-pill max-md:w-full',
                  { shape: 'rect', radius: 13 },
                )}
              >
                {t('jt.026')}
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-[26px] gap-y-[11px] text-body-sm font-bold text-[#a9b5d8] max-lg:mt-[22px] max-lg:flex-col max-lg:gap-[9px] max-lg:pt-1 max-lg:text-[13px] max-lg:text-white/60">
              {TRUST.map((id) => (
                <li key={id} className="inline-flex items-center gap-2">
                  <Tick />
                  {t(id)}
                </li>
              ))}
            </ul>
          </div>
          <HeroRoleCard
            cards={heroCards}
            labels={{
              title: t('jt.030'),
              lead: t('jt.031'),
              live: t('jt.032'),
              newBadge: t('jt.033'),
              footer: t('jt.034'),
              all: t('jt.035'),
            }}
          />
        </div>
        {/* ≤ 900 (`max-lg:` — lg is 901) the design stacks the strip (Join Our Team ll. 339–345):
            label, then ONE scrolling chip row, then the sentence. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 pt-[22px] pb-[26px] max-lg:flex-col max-lg:items-stretch max-lg:gap-y-2.5 max-lg:pt-3.5 max-lg:pb-[18px]">
          <p
            id="careers-countries-label"
            className="flex flex-none items-center gap-[9px] text-eyebrow font-extrabold tracking-[0.11em] text-[#a9b5d8] uppercase max-lg:text-[11px] max-lg:tracking-[1.1px] max-lg:text-white/50"
          >
            <MapPinIcon size={15} className="text-sky" />
            {t('jt.036')}
          </p>
          <ul
            data-testid="careers-countries"
            aria-labelledby="careers-countries-label"
            // a scroll region below 901 px: focusable so a keyboard can scroll it (axe
            // `scrollable-region-focusable`)
            tabIndex={0}
            className="flex flex-1 flex-wrap gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky max-lg:mx-[calc(var(--gutter)*-1)] max-lg:flex-none max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:bg-night max-lg:px-(--gutter) max-lg:pb-0.5 max-lg:[mask-image:linear-gradient(90deg,#000_calc(100%-28px),transparent)] max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
          >
            {sourceCountries.map((c) => (
              <li
                key={c.code}
                className="inline-flex items-center rounded-[9px] border border-white/20 bg-white/10 px-[13px] py-1.5 text-body-sm font-extrabold text-[#dbe3f5] max-lg:flex-none max-lg:rounded-lg max-lg:bg-[#1e2739] max-lg:px-2.5 max-lg:py-[5px] max-lg:text-[11.5px] max-lg:whitespace-nowrap max-lg:text-[#c2c6ce]"
              >
                {c.name}
              </li>
            ))}
          </ul>
          <p className="text-body-sm font-bold text-[#a9b5d8] max-lg:text-[12px] max-lg:leading-[1.5] max-lg:text-white/50">
            {t('jt.037')}
          </p>
        </div>
      </div>
    </Section>
  );
}

/** The worker notice band (design `.ja-jt-notice`): the package's own split sentence (W23) —
 *  `jt.043` is legal-flagged and renders verbatim. The inline link is underlined (axe
 *  `link-in-text-block`). */
export function WorkerNotice({ t }: { t: Tf }) {
  return (
    <div className="border-b border-warning-border bg-warning-surface py-4">
      <div
        data-testid="careers-notice"
        className="container-site flex flex-wrap items-center gap-3"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] bg-[#fef3c7] text-warning-text"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 text-body-sm text-text-secondary xl:text-balance">
          <strong className="text-ink">{t('jt.038')}</strong> {t('jt.039')} <em>{t('jt.040')}</em>{' '}
          {t('jt.041')}{' '}
          <Link
            href="/partner-with-us"
            prefetch={false}
            className="font-extrabold text-blue-safe underline"
          >
            {t('jt.042')}
          </Link>
          {t('jt.043')}
        </p>
      </div>
    </div>
  );
}
