import { ArrowRightIcon } from '@/design/chrome/icons';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { opsCareersStatus } from '../_lib/links';
import type { Tf } from '../_lib/roles';

/** The seven steps (design `steps[]`): title / body / when, the "Admira AI" badge on steps 3–4.
 *  Badge faces clear 4.5:1 under white text (D20): `blue-safe` for the design's #1899D5,
 *  `success-text` for its #16a34a. The "when" labels are package copy rendered as authored
 *  (parity-baselined; listed for the WP-C copy review). */
const STEPS = [
  { title: 'jt.263', body: 'jt.264', when: 'jt.265', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.266', body: 'jt.267', when: 'jt.268', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.269', body: 'jt.270', when: 'jt.271', ai: true, badge: 'bg-[#253063]' },
  { title: 'jt.272', body: 'jt.273', when: 'jt.274', ai: true, badge: 'bg-[#253063]' },
  { title: 'jt.275', body: 'jt.276', when: 'jt.277', ai: false, badge: 'bg-[#253063]' },
  { title: 'jt.278', body: 'jt.279', when: 'jt.280', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.281', body: 'jt.282', when: 'jt.283', ai: false, badge: 'bg-success-text' },
] as const;

/** Parity S6.2 / M11: 20 px numerals on 54 px tiles from 901 px; below, the design's compact
 *  steps (ll. 369–378) — a 42 px column, 36 px badges with 14 px numerals, the "when" label
 *  above the title in blue, a dark "Admira AI" badge (#0a1428 / sky). */
function StepList({ t }: { t: Tf }) {
  return (
    // The connector line sits beside the <ol>, never inside it: an <ol> holds <li>s only (axe `list`).
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute top-[30px] bottom-11 left-[25px] w-[3px] rounded-pill bg-[linear-gradient(180deg,#1899d5_0%,#253063_55%,#16a34a_100%)] opacity-25 max-lg:left-4"
      />
      <ol className="relative flex flex-col">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="ja-jt-step grid grid-cols-[54px_1fr] gap-5 pb-[22px] max-lg:grid-cols-[42px_1fr] max-lg:gap-3.5 max-lg:pb-[18px]"
          >
            <span
              aria-hidden="true"
              className={`relative z-[1] flex h-[54px] w-[54px] items-center justify-center rounded-[17px] text-[20px] font-extrabold text-white shadow-[0_8px_20px_rgba(22,60,90,0.18)] xl:text-[15px] max-lg:h-9 max-lg:w-9 max-lg:text-[14px] ${s.badge}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-[3px] max-lg:pt-0">
              <div className="mb-[5px] flex flex-wrap items-center gap-2.5 max-lg:gap-2">
                <h3 className="text-[17px] font-extrabold tracking-[-0.3px] xl:text-[12.75px] max-lg:text-[16px] max-lg:leading-[1.25]">
                  {t(s.title)}
                </h3>
                {s.ai && (
                  <span className="rounded-pill border border-[#ccd5ea] bg-[#edf1f9] px-2.5 py-[3px] text-[11px] font-extrabold tracking-[1px] text-indigo uppercase max-lg:border-transparent max-lg:bg-night max-lg:px-[9px] max-lg:tracking-[0.9px] max-lg:text-sky">
                    {t('jt.083')}
                  </span>
                )}
                <span className="text-[11.5px] font-extrabold tracking-[0.8px] text-text-tertiary uppercase xl:text-[11px] max-lg:order-first max-lg:basis-full max-lg:text-[11px] max-lg:tracking-[1.1px] max-lg:text-blue-safe">
                  {t(s.when)}
                </span>
              </div>
              <p className="max-w-[640px] text-[14.5px] leading-[1.62] font-semibold text-text-secondary xl:text-[11px] max-lg:text-[13.5px] max-lg:leading-[1.55]">
                {t(s.body)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The hiring process (design `.ja-jt-process`) — `full` on the index; `compact` on the detail
 *  page (the steps under their own h2, no section header). On the index the footer row ends in
 *  the navy "Check your application status" (`jt.085`, parity S6.1): the Operations status page
 *  in a new tab, in the page's locale (W245), restored by the owner — full width below 701 px. */
export function HiringSteps({
  t,
  locale,
  variant = 'full',
}: {
  t: Tf;
  locale: Locale;
  variant?: 'full' | 'compact';
}) {
  if (variant === 'compact') {
    return (
      <div
        data-testid="careers-process"
        className="rounded-lg border border-border-2 bg-white p-6 md:p-8"
      >
        <h2 className="mb-6 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
          {t('jt.081')}
        </h2>
        <StepList t={t} />
      </div>
    );
  }
  return (
    <Section tone="pale" className="ja-reveal border-t border-border-3">
      <div data-testid="careers-process" className="container-site">
        <div className="mb-8 max-w-[660px]">
          <Eyebrow>{t('jt.080')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
            {t('jt.081')}
          </h2>
          <p className="text-body text-text-secondary">{t('jt.082')}</p>
        </div>
        <div className="rounded-lg border border-border-2 bg-white px-[34px] py-8 shadow-[0_10px_30px_rgba(22,60,90,0.06)] max-lg:rounded-[18px] max-lg:px-4 max-lg:py-5">
          <StepList t={t} />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3.5 border-t border-border-3 pt-5 max-lg:mt-0.5 max-lg:gap-3 max-lg:pt-4">
            <p className="flex items-center gap-[11px] text-[14px] font-bold text-text-secondary xl:text-[11px] max-lg:text-[13px]">
              <span
                aria-hidden="true"
                className="ja-live ja-live-soft h-2 w-2 flex-none rounded-pill bg-success"
              />
              {t('jt.084')}
            </p>
            {/* the design's navy face (#253063 → #16204a on hover), 11 px radius; a page-local
                face — `Button` has no indigo variant (shared request) */}
            <a
              data-testid="careers-status"
              href={opsCareersStatus(locale)}
              target="_blank"
              rel="noopener"
              className="ja-hover-lift inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[11px] bg-indigo px-[22px] text-[14.5px] font-extrabold text-white no-underline hover:bg-[#16204a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px] max-lg:min-h-[50px] max-lg:rounded-xs max-md:w-full"
            >
              {t('jt.085')}
              <ArrowRightIcon size={14} />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
