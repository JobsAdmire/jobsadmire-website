import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** `when` is a resolved string (the Homepage's "Day 0" is home.104, Hire Workers' are the
 *  `hire.27x` ids) — the page reads it so a `when`-less step is simply absent. */
export type ProcessStep = { n: number; titleId: string; bodyId: string; when?: string };

const CARD = {
  cards:
    'rounded-md border border-border-2 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(22,60,90,0.06)] transition-shadow hover:shadow-card-hover',
  plain: '',
} as const;

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

/** The design's `.ja-tl-row` process timeline (Hire Workers 6 steps, Homepage 5, Contact 4,
 *  Partner, Work Permit, Available Workers): numbered gradient dots on a vertical rail that
 *  fades blue → green, a `when` pill per step, the last step's dot green. `cards` boxes each
 *  step (Hire Workers); `plain` is the Homepage/Contact row. The reveal is CSS on classes the
 *  one site-wide observer switches (`motion`), so the block stays a server component (W13). */
export function ProcessSteps({
  bundle,
  locale,
  steps,
  variant = 'cards',
  id,
  headingLevel = 3,
  motion,
}: {
  bundle: Bundle;
  locale: Locale;
  steps: ProcessStep[];
  variant?: 'cards' | 'plain';
  id?: string;
  headingLevel?: 3 | 4;
  motion?: ProcessMotion;
}) {
  const t = makeTf(bundle, locale);
  const Heading = `h${headingLevel}` as 'h3' | 'h4';
  return (
    <ol
      id={id}
      data-variant={variant}
      className={`${motion ? `${LIST_MOTION[motion]} ` : ''}relative m-0 grid list-none gap-4 p-0 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-[3px] before:rounded-[3px] before:bg-gradient-to-b before:from-tint-border before:via-blue before:to-success before:content-['']`}
    >
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={`${s.n}-${s.titleId}`}
            data-last={last ? 'true' : undefined}
            className={`${motion === 'timeline' ? 'ja-tl-row ' : ''}relative grid grid-cols-[36px_1fr] items-start gap-4`}
          >
            <span
              aria-hidden="true"
              className={[
                'relative z-[1] flex h-9 w-9 items-center justify-center rounded-pill text-body-sm font-extrabold text-white shadow-[0_0_0_5px_#fff]',
                last
                  ? 'bg-gradient-to-br from-success to-success-text'
                  : 'bg-gradient-to-br from-blue to-blue-safe',
              ].join(' ')}
            >
              {s.n}
            </span>
            <div
              className={
                motion === 'steps'
                  ? ['ja-step', CARD[variant]].filter(Boolean).join(' ')
                  : CARD[variant]
              }
            >
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <Heading className="text-card-title m-0">{t(s.titleId)}</Heading>
                {s.when && (
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
