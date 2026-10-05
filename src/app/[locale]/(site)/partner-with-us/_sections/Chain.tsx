import { Fragment } from 'react';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { CHAIN_IDS, type Tf } from '../_lib/content';

/** Supply → Recruitment → Demand. The highlighted node's white copy sits on blue-safe →
 *  darker blue (D20: white on the design's #1899D5 is 3.2:1). */
const NODE = {
  supply: {
    box: 'border border-tint-border bg-pale-1 max-md:before:border-blue',
    eyebrow: 'text-blue-safe',
    title: 'text-ink',
    body: 'text-text-secondary',
  },
  core: {
    box: 'bg-gradient-to-br from-blue-safe to-[#0b5c88] shadow-[0_18px_40px_rgba(24,153,213,0.28)] max-md:shadow-[0_12px_28px_rgba(24,153,213,0.26)] xl:shadow-[0_13.5px_30px_rgba(24,153,213,0.28)] max-md:before:border-blue-safe',
    eyebrow: 'text-white',
    title: 'text-white',
    body: 'text-white',
  },
  demand: {
    box: 'border border-tint-border bg-pale-1 max-md:before:border-success',
    eyebrow: 'text-success-text',
    title: 'text-ink',
    body: 'text-text-secondary',
  },
} as const;

/** ≤ 700 px (Partner With Us ll. 302–309, M5): the nodes hang off a blue → green rail at the
 *  left — a 26 px gutter column, the 2 px gradient line as the grid's `::before` — each card
 *  left-aligned with a white ring dot on the rail (its `::before`, the node's own colour). */
const RAIL =
  "max-md:relative max-md:grid-cols-[26px_1fr] max-md:gap-0 max-md:before:absolute max-md:before:top-5 max-md:before:bottom-5 max-md:before:left-[11px] max-md:before:w-0.5 max-md:before:rounded-[2px] max-md:before:bg-[linear-gradient(180deg,var(--color-blue)_0%,var(--color-blue-safe)_55%,var(--color-success)_100%)] max-md:before:content-['']";
const RAIL_NODE =
  "max-md:relative max-md:col-start-2 max-md:mb-2.5 max-md:rounded-[15px] max-md:px-4 max-md:py-[15px] max-md:last:mb-0 max-md:before:absolute max-md:before:top-[19px] max-md:before:-left-[21px] max-md:before:h-3 max-md:before:w-3 max-md:before:rounded-pill max-md:before:border-[3px] max-md:before:bg-white max-md:before:shadow-[0_0_0_3px_#fff] max-md:before:content-['']";

/** "Where you fit in the chain". The intro is the one sentence the package splits around its
 *  Hire Workers link (partner.048 + partner.002 + partner.049), so composing it is allowed
 *  (W23); the design's old-site href becomes the typed route; the in-text link is underlined
 *  (D20: colour alone does not mark it). Arrows from 901 px only; below that the nodes stack, and
 *  on phones they hang off the design's rail (`RAIL`). */
export function Chain({ tf }: { tf: Tf }) {
  return (
    <Section tone="light" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-chain">
        <h2 className="text-h2 m-0 mb-3 md:text-center max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
          {tf(CHAIN_IDS.heading)}
        </h2>
        <p className="m-0 mb-8 text-body text-text-tertiary md:mx-auto md:mb-11 md:max-w-[560px] md:text-center">
          {tf(CHAIN_IDS.introLead)}{' '}
          <Link
            prefetch={false}
            href="/hire-workers"
            className="font-bold text-blue-safe underline"
          >
            {tf(CHAIN_IDS.introLink)}
          </Link>{' '}
          {tf(CHAIN_IDS.introTail)}
        </p>
        <div
          className={`grid gap-3 lg:mx-auto lg:max-w-[1080px] lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-5 ${RAIL}`}
        >
          {CHAIN_IDS.nodes.map((node, i) => {
            const c = NODE[node.tone];
            return (
              <Fragment key={node.eyebrow}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-center text-[24px] xl:text-[18px] font-extrabold text-tint-border max-lg:hidden"
                  >
                    →
                  </span>
                )}
                <div className={`rounded-md px-6 py-6 lg:text-center ${RAIL_NODE} ${c.box}`}>
                  <p
                    className={`m-0 mb-2 text-eyebrow font-extrabold uppercase tracking-[1.2px] max-md:mb-1.5 max-md:text-[11px] xl:tracking-[0.9px] ${c.eyebrow}`}
                  >
                    {tf(node.eyebrow)}
                  </p>
                  <p
                    className={`m-0 mb-1 text-card-title font-extrabold max-md:text-[15.5px] ${c.title}`}
                  >
                    {tf(node.title)}
                  </p>
                  <p
                    className={`m-0 text-body-sm max-md:text-[13px] max-md:leading-[1.45] ${c.body}`}
                  >
                    {tf(node.body)}
                  </p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
