import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PROCESS_IDS, type Tf } from '../_lib/content';

/** "How a partnership starts": the foundation's `ProcessSteps` rail (delta 10); step 4's
 *  "Full access" pill is its `when`. The intro sits on the pale ground in `text-secondary`
 *  (tertiary on pale-1 is 4.49:1, D20). */
export function Process({ bundle, locale, tf }: { bundle: Bundle; locale: Locale; tf: Tf }) {
  const steps: ProcessStep[] = PROCESS_IDS.steps.map((s) => ({
    n: s.n,
    titleId: s.titleId,
    bodyId: s.bodyId,
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
        <div className="mx-auto max-w-[880px]">
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            steps={steps}
            variant="cards"
            id="how-it-starts"
            headingLevel={3}
            motion="steps"
          />
        </div>
      </div>
    </Section>
  );
}
