import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { CheckIcon, ClockIcon } from '@/design/chrome/icons';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The colour of a `timeline` node (Homepage: ink, blue, blue, navy, green). */
export type ProcessNodeTone = 'ink' | 'blue' | 'navy' | 'green';

/** `when` is a resolved string (the Homepage's "Day 0" is home.104, Hire Workers' are the
 *  `hire.27x` ids) — the page reads it so a `when`-less step is simply absent. `icon` is the
 *  step's line icon (the `row` variant's top-right glyph, the `icon` marker's white glyph);
 *  `tone` overrides a `timeline` node's colour. */
export type ProcessStep = {
  n: number;
  titleId: string;
  bodyId: string;
  when?: string;
  icon?: ReactNode;
  tone?: ProcessNodeTone;
};

/**
 * The design's process faces (SHARED 8), one name each:
 * - `cards` / `plain`: the pre-parity rail rows (boxed / unboxed) — kept for pages not yet moved;
 * - `timeline` (Homepage v4 ll. 635–700, SHARED 8.1): dark phase pills right-aligned in an 84 px
 *   column, 30 px check nodes ringed white + #dbe8f2, a blue → pale connector under each node;
 * - `numbered` (Hire Workers ll. 1011–1036, SHARED 8.2): 46 px gradient number dots double-ringed
 *   in a 90 px column on a blue → green rail, a white r18 card per step with its `when` pill (a
 *   clock with `whenIcon`), the last dot and pill green; on phones the pill sits above the title;
 * - `row` (Available Workers ll. 781–812, Partner process, SHARED 8.3): four equal cards in one row
 *   over a 3 px blue → green connector, 38 px number dots top-left, the line icon top-right, the
 *   last card's edge green; on phones the number and title share a line and the icon hides
 *   (`mobilePlain`: Partner's plain phone timeline, no boxes);
 * - `tint` (Contact message steps, SHARED 8.5): pale tint dots with a blue digit and a #bfdff0
 *   ring on a pale rail, the last step green-tinted.
 * `marker="icon"` puts each step's `icon` in the dot instead of its number (SHARED 8.4);
 * `whenStyle="caps"` prints `when` as an 11 px uppercase pill inline after the title (8.4);
 * `compactMobile` folds each step to a 32 px number + title row with the body below ≤ 460 px
 * (Work Permit M.7, Join M11 — SHARED 8.6).
 */
export type ProcessVariant = 'cards' | 'plain' | 'timeline' | 'numbered' | 'row' | 'tint';

/** How the steps enter once the observer reveals them (src/design/motion/motion.css) — the
 *  design animates each page's process its own way:
 *  - `stagger` (Homepage): the rows tick in one by one and the rail grows down (`.ja-stagger`,
 *    `.ja-grow`); the list must sit inside a `.ja-reveal` section;
 *  - `timeline` (Hire Workers): the rail draws down and the rows rise 120 ms apart
 *    (`.ja-tl-on`, `.ja-tl-line`, `.ja-tl-row`);
 *  - `steps` (Available Workers, Partner With Us): the cards rise together and lift under the
 *    pointer while the rail draws (`.ja-step`, `.ja-journey-line`).
 *  Without it the list is static (Contact, whose design does not animate it). */
export type ProcessMotion = 'stagger' | 'timeline' | 'steps';

const LIST_MOTION: Record<ProcessMotion, string> = {
  stagger: 'ja-stagger ja-grow-rail',
  timeline: 'ja-reveal-group ja-tl-rail',
  steps: 'ja-reveal-group ja-journey-rail',
};

const CARD = {
  cards:
    'rounded-md border border-border-2 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(22,60,90,0.06)] transition-shadow hover:shadow-card-hover',
  plain: '',
} as const;

const NODE: Record<ProcessNodeTone, string> = {
  ink: 'bg-ink',
  blue: 'bg-blue',
  navy: 'bg-indigo',
  green: 'bg-success',
};
const TIMELINE_TONES: ProcessNodeTone[] = ['ink', 'blue', 'blue', 'navy', 'green'];

/** `whenStyle="caps"`: the design's 10.5–11 px UPPERCASE letter-spaced pill inline after the
 *  title (Available Workers BAŞLANGIÇ / 1–3. GÜN, Partner S7.2). */
function CapsWhen({ when, last }: { when: string; last: boolean }) {
  return (
    <span
      className={[
        'ml-2 inline-block rounded-pill px-2 py-[3px] align-middle text-[10.5px] leading-none font-extrabold tracking-[0.8px] whitespace-nowrap uppercase xl:text-[11px]',
        last ? 'bg-success-soft text-success-text' : 'bg-tint text-blue-safe',
      ].join(' ')}
    >
      {when}
    </span>
  );
}

export function ProcessSteps({
  bundle,
  locale,
  steps,
  variant = 'cards',
  id,
  headingLevel = 3,
  motion,
  marker = 'number',
  whenStyle = 'pill',
  whenIcon = false,
  compactMobile = false,
  mobilePlain = false,
}: {
  bundle: Bundle;
  locale: Locale;
  steps: ProcessStep[];
  variant?: ProcessVariant;
  id?: string;
  headingLevel?: 3 | 4;
  motion?: ProcessMotion;
  /** `number` (default) or `icon`: each step's `icon` in the dot (SHARED 8.4) */
  marker?: 'number' | 'icon';
  /** `pill` (right-aligned pill, default) or `caps` (uppercase pill inline after the title) */
  whenStyle?: 'pill' | 'caps';
  /** `numbered`: a clock before each `when` (Hire Workers' duration pills) */
  whenIcon?: boolean;
  /** ≤ 460 px: number + title on one row, body below, icon hidden (SHARED 8.6) */
  compactMobile?: boolean;
  /** `row` on phones: a plain dotted timeline without card boxes (Partner M7) */
  mobilePlain?: boolean;
}) {
  const t = makeTf(bundle, locale);
  const Heading = `h${headingLevel}` as 'h3' | 'h4';
  const motionCls = motion ? `${LIST_MOTION[motion]} ` : '';
  const dotContent = (s: ProcessStep) => (marker === 'icon' && s.icon ? s.icon : s.n);

  if (variant === 'timeline') {
    return (
      <ol
        id={id}
        data-variant={variant}
        className={`${motion === 'stagger' ? 'ja-stagger ' : ''}m-0 list-none p-0`}
      >
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const tone = s.tone ?? (last ? 'green' : TIMELINE_TONES[i % TIMELINE_TONES.length]);
          return (
            <li
              key={`${s.n}-${s.titleId}`}
              data-last={last ? 'true' : undefined}
              className="flex gap-[18px] max-xs:grid max-xs:grid-cols-[30px_1fr] max-xs:gap-x-3.5 max-xs:gap-y-0"
            >
              <div className="w-[84px] flex-none pt-1 text-right max-xs:col-start-2 max-xs:row-start-1 max-xs:w-auto max-xs:pt-0 max-xs:pb-1.5 max-xs:text-left xl:w-[63px]">
                {s.when && (
                  <span className="inline-block rounded-pill bg-ink px-[11px] py-1 text-[11px] font-extrabold tracking-[0.4px] whitespace-nowrap text-white">
                    {s.when}
                  </span>
                )}
              </div>
              <div
                aria-hidden="true"
                className="flex flex-none flex-col items-center max-xs:col-start-1 max-xs:row-span-2 max-xs:row-start-1"
              >
                <span
                  className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-pill text-white shadow-[0_0_0_4px_#fff,0_0_0_5.5px_var(--color-border-1)] ${NODE[tone]}`}
                >
                  {marker === 'icon' && s.icon ? s.icon : <CheckIcon size={13} />}
                </span>
                {!last && (
                  <span
                    className={`${motion === 'stagger' ? 'ja-grow ' : ''}mt-[7px] block min-h-[22px] w-[2.5px] flex-1 rounded-[2px] bg-gradient-to-b from-blue to-tint-border`}
                  />
                )}
              </div>
              <div className="pb-[26px] max-xs:col-start-2 max-xs:row-start-2 max-xs:pb-4">
                <Heading className="m-0 pt-0.5 font-display text-[19px] font-extrabold tracking-[-0.5px] max-xs:text-[17px] xl:text-[14.25px]">
                  {t(s.titleId)}
                </Heading>
                <p className="m-0 mt-1 max-w-[540px] text-[13.5px] leading-[1.55] font-semibold text-text-secondary max-xs:text-[13px] max-xs:leading-[1.5] xl:text-[11px]">
                  {t(s.bodyId)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  if (variant === 'numbered') {
    return (
      <ol
        id={id}
        data-variant={variant}
        className={`${motionCls}relative mx-auto my-0 max-w-[760px] list-none p-0 before:absolute before:top-[30px] before:bottom-[30px] before:left-[45px] before:-ml-[1.5px] before:w-[3px] before:rounded-[3px] before:bg-gradient-to-b before:from-tint-border before:via-blue before:to-success before:content-[''] max-md:before:left-[21px] max-xs:before:top-6 max-xs:before:bottom-6 max-xs:before:left-4 max-xs:before:w-0.5 xl:max-w-[570px]`}
      >
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={`${s.n}-${s.titleId}`}
              data-last={last ? 'true' : undefined}
              className={`${motion === 'timeline' ? 'ja-tl-row ' : ''}relative grid grid-cols-[90px_1fr] items-center py-3.5 max-md:grid-cols-[44px_1fr] max-xs:grid-cols-[32px_1fr] max-xs:items-start max-xs:gap-x-3 max-xs:py-[7px]`}
            >
              <span
                aria-hidden="true"
                className={[
                  'relative z-[1] col-start-1 row-start-1 ml-[22px] flex h-[46px] w-[46px] items-center justify-center justify-self-start rounded-pill text-[17px] font-extrabold text-white max-md:ml-0 max-md:h-[38px] max-md:w-[38px] max-md:text-[14px] max-xs:h-8 max-xs:w-8 max-xs:text-[13.5px]',
                  last
                    ? 'bg-gradient-to-br from-success-text to-success-deep shadow-[0_0_0_6px_var(--color-pale-1),0_0_0_7.5px_#c8ecd4]'
                    : 'bg-gradient-to-br from-blue-safe to-blue-deep shadow-[0_0_0_6px_var(--color-pale-1),0_0_0_7.5px_#cfe5f2]',
                ].join(' ')}
              >
                {dotContent(s)}
              </span>
              <div className="ja-hover-card col-start-2 row-start-1 rounded-[18px] border border-edge-soft bg-white px-[26px] py-[22px] shadow-[0_8px_24px_rgba(22,60,90,0.06)] max-md:rounded-[15px] max-md:px-[18px] max-md:py-4">
                <div className="mb-1.5 flex items-center justify-between gap-3 max-md:flex-col-reverse max-md:items-start max-md:gap-1.5">
                  <Heading className="m-0 text-[18px] font-extrabold max-md:text-[16px] xl:text-[13.5px]">
                    {t(s.titleId)}
                  </Heading>
                  {s.when && (
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 rounded-pill border px-4 py-1.5 text-[12.5px] font-extrabold whitespace-nowrap max-md:px-3 max-md:py-[5px] max-md:text-[11.5px] xl:text-[11px]',
                        last
                          ? 'border-success-soft-border bg-success-soft text-success-text'
                          : 'border-tint-border bg-tint text-blue-safe',
                      ].join(' ')}
                    >
                      {whenIcon && <ClockIcon size={13} />}
                      {s.when}
                    </span>
                  )}
                </div>
                <p className="m-0 text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
                  {t(s.bodyId)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  if (variant === 'row') {
    return (
      <div id={id} data-variant={variant} className={`${motionCls}relative`}>
        {/* the connector runs through the dots' centre, behind the cards (45 px in) */}
        <div
          aria-hidden="true"
          className={`${motion === 'steps' ? 'ja-journey-line ' : ''}absolute top-[45px] right-[45px] left-[45px] z-0 h-[3px] rounded-pill bg-gradient-to-r from-blue via-blue-safe via-60% to-success max-md:hidden xl:top-[34px]`}
        />
        <ol
          className={`relative z-[1] m-0 grid list-none gap-6 p-0 md:grid-cols-4 ${mobilePlain ? 'max-md:gap-0' : 'max-md:gap-2.5'}`}
        >
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <li
                key={`${s.n}-${s.titleId}`}
                data-last={last ? 'true' : undefined}
                style={motion === 'steps' ? { transitionDelay: `${i * 0.15}s` } : undefined}
                className={[
                  motion === 'steps' ? 'ja-step' : 'ja-hover-card ja-hover-card-lg',
                  'rounded-[18px] border bg-white px-6 py-[26px] max-md:grid max-md:grid-cols-[34px_1fr] max-md:items-start max-md:gap-x-3 max-md:gap-y-1.5 max-md:py-3.5',
                  last ? 'border-success-soft-border' : 'border-edge-soft',
                  mobilePlain
                    ? 'max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:px-0'
                    : 'max-md:rounded-sm max-md:px-[15px]',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="mb-4 flex items-center justify-between max-md:col-start-1 max-md:row-start-1 max-md:mb-0 max-md:block">
                  <span
                    aria-hidden="true"
                    className={[
                      'flex h-[38px] w-[38px] items-center justify-center rounded-pill text-[15px] font-extrabold text-white max-md:h-8 max-md:w-8 max-md:text-[13.5px]',
                      last
                        ? 'bg-gradient-to-br from-success-text to-success-deep shadow-[0_0_0_5px_var(--color-success-soft)]'
                        : 'bg-gradient-to-br from-blue-safe to-blue-deep shadow-[0_0_0_5px_#eaf3f8]',
                    ].join(' ')}
                  >
                    {dotContent(s)}
                  </span>
                  {marker === 'number' && s.icon && (
                    <span aria-hidden="true" className="text-[#8fb6cd] max-md:hidden">
                      {s.icon}
                    </span>
                  )}
                </div>
                <Heading className="m-0 mb-1.5 text-[16.5px] font-extrabold max-md:col-start-2 max-md:row-start-1 max-md:mb-0 max-md:self-center max-md:text-[15.5px] max-md:leading-[1.3] xl:text-[12.4px]">
                  {t(s.titleId)}
                  {s.when && <CapsWhen when={s.when} last={last} />}
                </Heading>
                <p className="m-0 text-[14px] leading-[1.6] text-text-secondary max-md:col-span-2 max-md:row-start-2 max-md:text-[13px] max-md:leading-[1.5] xl:text-[11px]">
                  {t(s.bodyId)}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (variant === 'tint') {
    return (
      <ol
        id={id}
        data-variant={variant}
        className={`${motionCls}relative m-0 grid list-none gap-4 p-0 before:absolute before:top-6 before:bottom-6 before:left-[17px] before:w-0.5 before:rounded-pill before:bg-gradient-to-b before:from-tint-border before:to-edge-soft before:content-['']`}
      >
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={`${s.n}-${s.titleId}`}
              data-last={last ? 'true' : undefined}
              className="relative grid grid-cols-[36px_1fr] items-start gap-4"
            >
              <span
                aria-hidden="true"
                className={[
                  'relative z-[1] flex h-9 w-9 items-center justify-center rounded-pill border-[1.5px] text-body-sm font-extrabold shadow-[0_0_0_4px_#fff]',
                  last
                    ? 'border-success-soft-border bg-success-soft text-success-text'
                    : 'border-tint-border bg-tint text-blue-safe',
                ].join(' ')}
              >
                {dotContent(s)}
              </span>
              <div>
                <Heading className="text-card-title m-0 mb-1">
                  {t(s.titleId)}
                  {s.when && whenStyle === 'caps' && <CapsWhen when={s.when} last={last} />}
                </Heading>
                <p className="text-body-sm m-0 text-text-secondary">{t(s.bodyId)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  // `cards` / `plain` — the pre-parity rail rows, unchanged apart from the opt-in props.
  return (
    <ol
      id={id}
      data-variant={variant}
      className={`${motionCls}relative m-0 grid list-none gap-4 p-0 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-[3px] before:rounded-[3px] before:bg-gradient-to-b before:from-tint-border before:via-blue before:to-success before:content-['']${compactMobile ? ' max-xs:before:left-[15px]' : ''}`}
    >
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={`${s.n}-${s.titleId}`}
            data-last={last ? 'true' : undefined}
            className={`${motion === 'timeline' ? 'ja-tl-row ' : ''}relative grid grid-cols-[36px_1fr] items-start gap-4${compactMobile ? ' max-xs:grid-cols-[32px_1fr] max-xs:gap-x-3' : ''}`}
          >
            <span
              aria-hidden="true"
              className={[
                'relative z-[1] flex h-9 w-9 items-center justify-center rounded-pill text-body-sm font-extrabold text-white shadow-[0_0_0_5px_#fff]',
                compactMobile ? 'max-xs:h-8 max-xs:w-8' : null,
                last
                  ? 'bg-gradient-to-br from-success to-success-text'
                  : 'bg-gradient-to-br from-blue to-blue-safe',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {dotContent(s)}
            </span>
            <div
              className={
                motion === 'steps'
                  ? ['ja-step', CARD[variant as 'cards' | 'plain']].filter(Boolean).join(' ')
                  : CARD[variant as 'cards' | 'plain']
              }
            >
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <Heading className="text-card-title m-0">
                  {t(s.titleId)}
                  {s.when && whenStyle === 'caps' && <CapsWhen when={s.when} last={last} />}
                </Heading>
                {s.when && whenStyle === 'pill' && (
                  <span
                    className={[
                      'whitespace-nowrap rounded-pill border px-3 py-1 text-eyebrow font-extrabold',
                      last
                        ? 'border-success-border bg-success-surface text-success-text'
                        : 'border-tint-border bg-tint text-blue-safe',
                    ].join(' ')}
                  >
                    {s.when}
                  </span>
                )}
              </div>
              <p className="text-body-sm m-0 text-text-secondary">{t(s.bodyId)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
