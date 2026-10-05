import { Section } from '@/design/primitives/Section';
import { CheckIcon, CrossIcon } from '../_components/icons';
import { COMPARE_ROWS } from '../_lib/tables';

// ≤ 700 px the design's compact card (`.ja-cmp-*` ll. 112–124): 11.5 px heads, 19 px marks,
// 14.5 / 12.5 px rows, 20 × 17 px padding, r17
const HEAD =
  'm-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px] max-md:mb-3.25 max-md:text-[11.5px] max-md:tracking-[1.2px]';
const MARK =
  'flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill max-md:mt-px max-md:h-[19px] max-md:w-[19px]';
const CARD = 'rounded-lg p-8 max-md:rounded-[17px] max-md:px-4.25 max-md:py-5';
const LIST = 'm-0 flex list-none flex-col gap-4 p-0 max-md:gap-3';
const ROW = 'flex items-start gap-3 max-md:gap-2.75';
const TITLE = 'm-0 text-body max-md:text-[14.5px] max-md:leading-[1.3]';
const SUB = 'm-0 mt-0.5 text-body-sm max-md:text-[12.5px] max-md:leading-[1.45]';

/** Design `#compare`: "On your own" vs "With JobsAdmire" (legal-flagged rows render verbatim). */
export function Comparison({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="light" id="compare" className="scroll-mt-20 pt-0">
      <div className="container-site" data-testid="hire-compare">
        <h2 className="m-0 mb-4 text-center text-h2 leading-[1.05] tracking-[-1.6px] max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px] xl:tracking-[-1.2px]">
          {tf('hire.146')}
        </h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-5.5 max-md:text-[14.5px]">
          {tf('hire.147')}
        </p>
        <div className="grid gap-6 max-md:gap-3.5 lg:grid-cols-2">
          <div className={`${CARD} border border-border-2 bg-white`}>
            <h3 className={`${HEAD} text-text-tertiary`}>{tf('hire.148')}</h3>
            <ul className={LIST}>
              {COMPARE_ROWS.own.map((r) => (
                <li key={r.titleId} className={ROW}>
                  <span aria-hidden="true" className={`${MARK} bg-border-3 text-text-tertiary`}>
                    <CrossIcon size={12} />
                  </span>
                  <div>
                    <p className={`${TITLE} font-bold text-text-secondary`}>{tf(r.titleId)}</p>
                    <p className={`${SUB} text-text-tertiary`}>{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div
            className={`${CARD} border-[1.5px] border-tint-border bg-gradient-to-b from-pale-1 to-tint shadow-[0_18px_44px_rgba(22,60,90,0.1)] max-md:shadow-[0_10px_26px_rgba(22,60,90,0.09)] xl:shadow-[0_13.5px_33px_rgba(22,60,90,0.1)]`}
          >
            <h3 className={`${HEAD} text-blue-safe`}>{tf('hire.149')}</h3>
            <ul className={LIST}>
              {COMPARE_ROWS.with.map((r) => (
                <li key={r.titleId} className={ROW}>
                  <span aria-hidden="true" className={`${MARK} bg-success text-white`}>
                    <CheckIcon size={13} />
                  </span>
                  <div>
                    <p className={`${TITLE} font-extrabold text-ink`}>{tf(r.titleId)}</p>
                    <p className={`${SUB} text-text-secondary`}>{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
