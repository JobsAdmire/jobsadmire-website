import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';
import { PROCESS_STEPS } from '../_lib/tables';

const CROSS_LINK = 'font-extrabold text-blue-safe no-underline';

export function Process({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const steps: ProcessStep[] = PROCESS_STEPS.map((s) => ({
    n: s.n,
    titleId: s.titleId,
    bodyId: s.bodyId,
    when: tf(s.whenId),
  }));
  const [ta, tb] = [tf('hire.170'), tf('hire.171')];
  const [l1a, l1b, l1c] = [tf('hire.174'), tf('hire.175'), tf('hire.176')];
  const [l2a, l2b, l2c] = [tf('hire.177'), tf('hire.178'), tf('hire.179')];
  return (
    <Section tone="pale" id="process" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-process">
        {/* this page's process h2 has the same size as its other h2s (clamp 28–42 px) — the
            46 px `text-h2-process` token is the homepage's */}
        <h2 className="m-0 mb-4 text-center text-h2 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px]">
          {ta}
          {sp(ta, tb)}
          <span className="text-blue-safe">{tb}</span>
        </h2>
        {/* D20: #64748b on the pale #f4f9fc is 4.49:1 — the pale sections use text-secondary */}
        <p className="mx-auto mb-4 mt-0 max-w-[540px] text-center text-body-lg text-text-secondary">
          {tf('hire.172')}
        </p>
        <div className="mb-11 text-center max-md:mb-7">
          <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-5 py-2 text-body-sm font-extrabold text-success-text">
            {tf('hire.173')}
          </p>
          {/* The design's two cross-links are absolute www.jobsadmire.com URLs — locale-aware
              here. prefetch={false}: /work-permit and /hiring-cost-calculator stay in
              UNBUILT_PATHNAMES until T4/T3 (W99), so a viewport prefetch would 404. */}
          <p className="m-0 mt-3.5 text-body-sm text-text-secondary max-md:text-left">
            {l1a}
            {sp(l1a, l1b)}
            <Link href="/work-permit" prefetch={false} className={CROSS_LINK}>
              {l1b}
            </Link>
            {sp(l1b, l1c)}
            {l1c}
          </p>
          <p className="m-0 mt-2 text-body-sm text-text-secondary max-md:text-left">
            {l2a}
            {sp(l2a, l2b)}
            <Link href="/hiring-cost-calculator" prefetch={false} className={CROSS_LINK}>
              {l2b}
            </Link>
            {sp(l2b, l2c)}
            {l2c}
          </p>
        </div>
        <div className="mx-auto max-w-[760px]">
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            steps={steps}
            variant="cards"
            headingLevel={3}
          />
        </div>
      </div>
    </Section>
  );
}
