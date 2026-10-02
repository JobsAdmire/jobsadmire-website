import { useTranslations } from 'next-intl';
import { getCollection } from '@/content/collections';
import { makeTf, metricValues } from '@/content/pure';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { CheckIcon, TelegramIcon } from '@/design/chrome/icons';
import { Flag } from '@/design/Flag';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

// W155 pattern: a colourless pill base + the design's own colour pair per link. Neither link is a
// contact door (t.me is not tel:/wa.me/mailto:; /verify is internal), so they are plain links —
// not `Button` callers, and no caller class ever lands on a `Button` base (W122).
const PILL =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill border-[1.5px] px-6 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const TELEGRAM = 'border-[#b6e0f5] bg-[#e8f6fd] text-blue-safe hover:bg-[#d6eefb]';
const FRAUD = 'border-danger-border bg-white text-danger hover:bg-danger-surface';

/**
 * "Agent network" (design lines 762–800). From 461 px the build-time `SourceMap` (W14 — 13
 * sourcing countries + Türkiye, no runtime fetch) and the flag chips; at ≤ 460 px the dark country
 * card (`.ja-net-mobile`) — both in the DOM, CSS decides (W10). Countries come from the
 * `sourceCountries` collection and the count from the `countries` metric (W1). The map is inline
 * SVG in the eighth block of the page: below the fold, the placement the final review's P-1 rule
 * accepts for its document weight. "Report fraud" goes to the Verify page's fraud form (`#report`,
 * CTA_BY_PATHNAME['/verify']) instead of the design's WhatsApp prefill.
 */
export function NetworkSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const countries = getCollection(bundle, 'sourceCountries');
  const count = metricValues(bundle, locale).countries ?? String(countries.length);
  return (
    <Section tone="light" id="network">
      <div
        data-testid="network"
        className="container-site grid items-center gap-[34px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[60px] xl:gap-[45px]"
      >
        <div className="min-w-0 max-xs:hidden">
          <SourceMap
            title={sys('home.network.mapTitle')}
            labels={sourceMapLabels(countries)}
            turkiyeLabel={sys('home.network.turkiye')}
          />
        </div>
        <div className="min-w-0">
          <Eyebrow>{tf('home.119')}</Eyebrow>
          <h2 className={`${H2} mb-4 mt-3.5`}>{tf('home.120')}</h2>
          <p className={`${LEAD} m-0 mb-[22px]`}>{tf('home.121')}</p>
          <div className="relative mb-[22px] overflow-hidden rounded-xl bg-navy px-5 pb-5 pt-[22px] text-white xs:hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[90px] -top-[110px] h-[280px] w-[280px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.28),transparent_65%)]"
            />
            <p className="relative m-0 mb-4 flex items-baseline gap-2.5">
              <span className="font-display text-[34px] font-extrabold leading-none tracking-[-1.4px]">
                {count}
              </span>
              <span className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-sky">
                {tf('home.122')}
              </span>
            </p>
            <ul className="relative m-0 mb-4 grid list-none grid-cols-2 gap-2 p-0">
              {countries.map((country) => (
                <li
                  key={country.code}
                  data-chip="phone"
                  className="flex min-w-0 items-center gap-[9px] overflow-hidden whitespace-nowrap rounded-xs border border-white/15 bg-white/7 px-[11px] py-[9px] text-[13px] font-bold"
                >
                  {isFlagCode(country.code) ? <Flag code={country.code} size={18} /> : null}
                  {country.name}
                </li>
              ))}
            </ul>
            <ul className="relative m-0 flex list-none flex-col gap-[9px] border-t border-white/15 p-0 pt-3.5">
              {(['home.123', 'home.124'] as const).map((id) => (
                <li
                  key={id}
                  className="flex items-start gap-[9px] text-[12.5px] font-bold leading-normal text-white/80"
                >
                  <CheckIcon size={15} className="mt-0.5 shrink-0 text-[#5ddfb0]" />
                  {tf(id)}
                </li>
              ))}
            </ul>
          </div>
          <ul className="m-0 mb-[26px] flex list-none flex-wrap gap-2 p-0 max-xs:hidden">
            {countries.map((country) => (
              <li
                key={country.code}
                data-chip="desktop"
                className="inline-flex items-center gap-2 rounded-pill border border-border-1 bg-pale-1 px-3.5 py-[7px] text-[13px] font-bold text-[#43536a]"
              >
                {isFlagCode(country.code) ? <Flag code={country.code} size={18} /> : null}
                {country.name}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button variant="nav" href="/partner-with-us">
              {tf('home.125')}
            </Button>
            <a
              href={bundle.settings.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${PILL} ${TELEGRAM}`}
            >
              <TelegramIcon size={17} />
              {tf('home.202')}
            </a>
            <Link
              prefetch={false}
              href={{ pathname: '/verify', hash: '#report' }}
              className={`${PILL} ${FRAUD}`}
            >
              {tf('home.126')}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
