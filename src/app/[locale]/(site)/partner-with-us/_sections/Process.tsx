import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { StepIcon, type StepIconKind } from '../_components/icons';
import { PROCESS_IDS, type Tf } from '../_lib/content';

/** The design's top-right line icon per step (ll. 913–937); the last one green like its card. */
const ICONS: readonly StepIconKind[] = ['doc', 'video', 'lock', 'unlock'];

/** ≤ 700 px (ll. 353–362, M6) the journey is a plain timeline — `ProcessSteps`' `mobilePlain`
 *  drops the card boxes and the horizontal line; this wrapper draws the design's vertical
 *  gradient rail (#1E9EE8 → #1073a8 → #22c55e) through the 32 px dots, behind the list. */
const PHONE_RAIL =
  "relative max-md:before:absolute max-md:before:top-[30px] max-md:before:bottom-[46px] max-md:before:left-[15px] max-md:before:w-0.5 max-md:before:rounded-[2px] max-md:before:bg-[linear-gradient(180deg,var(--color-blue)_0%,var(--color-blue-safe)_58%,var(--color-success)_100%)] max-md:before:content-['']";

/** "How a partnership starts" (ll. 902–948, S7.1): the design's journey — four equal cards in
 *  one row over the 3 px blue → green line, 38 px gradient number dots, the line icon top-right,
 *  step 4 with the green edge and its uppercase "FULL ACCESS" pill inline after the title (S7.2,
 *  `ProcessSteps` `row`). Motion `steps`: the line draws (scaleX 1.1 s) and the cards rise
 *  0 / .15 / .3 / .45 s apart once in view, lifting 5 px under the pointer. The intro sits on
 *  the pale ground in `text-secondary` (tertiary on pale-1 is 4.49:1, D20). */
export function Process({ bundle, locale, tf }: { bundle: Bundle; locale: Locale; tf: Tf }) {
  const steps: ProcessStep[] = PROCESS_IDS.steps.map((s, i) => ({
    n: s.n,
    titleId: s.titleId,
    bodyId: s.bodyId,
    icon: (
      <StepIcon
        kind={ICONS[i]}
        className={i === PROCESS_IDS.steps.length - 1 ? 'text-success' : undefined}
      />
    ),
    ...(s.whenId ? { when: tf(s.whenId) } : {}),
  }));
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="partner-process">
        <h2 className="text-h2 m-0 mb-3 md:text-center max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
          {tf(PROCESS_IDS.heading)}
        </h2>
        <p className="m-0 mb-8 text-body text-text-secondary md:mx-auto md:mb-11 md:max-w-[560px] md:text-center">
          {tf(PROCESS_IDS.intro)}
        </p>
        <div className={PHONE_RAIL}>
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            steps={steps}
            variant="row"
            id="how-it-starts"
            headingLevel={3}
            motion="steps"
            mobilePlain
          />
        </div>
      </div>
    </Section>
  );
}
