import { Section } from '@/design/primitives/Section';
import { CheckIcon, CrossIcon } from '../_components/icons';
import { COMPARE_ROWS } from '../_lib/tables';

const HEAD = 'm-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px]';
const MARK = 'flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill';

/** Design `#compare`: "On your own" vs "With JobsAdmire" (legal-flagged rows render verbatim). */
export function Comparison({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="light" id="compare" className="scroll-mt-20 pt-0">
      <div className="container-site" data-testid="hire-compare">
        <h2 className="m-0 mb-4 text-center text-h2 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px]">
          {tf('hire.146')}
        </h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-6">
          {tf('hire.147')}
        </p>
        <div className="grid gap-6 max-md:gap-3.5 lg:grid-cols-2">
          <div className="rounded-lg border border-border-2 bg-white p-8 max-md:px-4 max-md:py-5">
            <h3 className={`${HEAD} text-text-tertiary`}>{tf('hire.148')}</h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.own.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`${MARK} bg-border-3 text-text-tertiary`}>
                    <CrossIcon size={12} />
                  </span>
                  <div>
                    <p className="m-0 text-body font-bold text-text-secondary">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-tertiary">{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-[1.5px] border-tint-border bg-gradient-to-b from-pale-1 to-tint p-8 shadow-card-hover max-md:px-4 max-md:py-5">
            <h3 className={`${HEAD} text-blue-safe`}>{tf('hire.149')}</h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.with.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`${MARK} bg-success text-white`}>
                    <CheckIcon size={13} />
                  </span>
                  <div>
                    <p className="m-0 text-body font-extrabold text-ink">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf(r.bodyId)}</p>
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
