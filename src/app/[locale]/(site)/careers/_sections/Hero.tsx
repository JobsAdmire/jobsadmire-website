import { useTranslations } from 'next-intl';
import type { SourceCountry } from '@/content/collections';
import { isFlagCode } from '@/design/assets/flag-codes';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { Flag } from '@/design/Flag';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { HeroRoleCard } from '../_components/HeroRoleCard';
import type { RoleCard, Tf } from '../_lib/roles';

/** The design's navy gradient (`.ja-jt-hero`); its glows and dot grid are decoration left out. */
const HERO_BG = 'bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)]';
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
      className="flex-none text-[#4ade80]"
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
 */
export function CareersHero({
  t,
  locale,
  openingsCount,
  heroCards,
  sourceCountries,
}: {
  t: Tf;
  locale: Locale;
  openingsCount: number;
  heroCards: RoleCard[];
  sourceCountries: SourceCountry[];
}) {
  const sys = useTranslations('sys');
  return (
    <Section tone="dark" className={`pt-8 pb-0 ${HERO_BG}`}>
      <div className="container-site">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('jt.021'), href: '/' },
            { name: t('jt.005'), href: '/careers' },
          ]}
        />
        <div className="grid items-center gap-8 pt-6 pb-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
          <div className="min-w-0">
            {openingsCount > 0 && (
              <p
                data-testid="careers-hiring-count"
                className="mb-5 inline-flex items-center gap-2 rounded-pill border border-[#4ade80]/40 bg-[#16a34a]/15 px-4 py-1.5 text-body-sm font-extrabold text-[#86efac]"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-[#4ade80]" />
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
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#roles" className={buttonClassName('primary', 'lg')}>
                {sys('careers.hero.seeOpenings', { count: openingsCount })}
              </a>
              <a href="#apply" className={buttonClassName('inverse', 'lg')}>
                {t('jt.026')}
              </a>
            </div>
            <ul className="mt-7 flex flex-col gap-2 text-body-sm font-bold text-[#a9b5d8] sm:flex-row sm:flex-wrap sm:gap-x-6">
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
        {/* ≤ 900 (`max-lg:` — lg is 901) the design stacks the strip (Join Our Team ll. 339–342):
            label, then ONE scrollable chip line bleeding into the 20 px gutters with the scrollbar
            hidden, then the sentence. As one wrapping row the `flex-1` list was squeezed between
            label and sentence into a one-chip column (QA W220 CAR-01). */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 py-6 max-lg:flex-col max-lg:items-stretch max-lg:gap-y-2.5 max-lg:pt-3.5 max-lg:pb-[18px]">
          <p
            id="careers-countries-label"
            className="text-eyebrow font-extrabold uppercase tracking-[0.11em] text-[#a9b5d8]"
          >
            {t('jt.036')}
          </p>
          <ul
            aria-labelledby="careers-countries-label"
            className="flex flex-1 flex-wrap gap-2 max-lg:-mx-5 max-lg:min-w-0 max-lg:flex-none max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:px-5 max-lg:pb-0.5 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
          >
            {sourceCountries.map((c) => (
              <li
                key={c.code}
                className="inline-flex items-center gap-2 rounded-[9px] border border-white/20 bg-white/10 px-3 py-1.5 text-body-sm font-extrabold text-[#dbe3f5] max-lg:flex-none max-lg:whitespace-nowrap"
              >
                {isFlagCode(c.code) && <Flag code={c.code} size={16} />}
                {c.name}
              </li>
            ))}
          </ul>
          <p className="text-body-sm font-bold text-[#a9b5d8]">{t('jt.037')}</p>
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
        <p className="min-w-0 flex-1 text-body-sm text-text-secondary">
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
