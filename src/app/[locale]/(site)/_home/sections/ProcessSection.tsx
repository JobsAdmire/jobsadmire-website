import { makeTf } from '@/content/pure';
import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { SectionProps } from './types';

const STEPS = [
  { n: 1, whenId: 'home.104', titleId: 'home.105', bodyId: 'home.106' },
  { n: 2, whenId: 'home.107', titleId: 'home.108', bodyId: 'home.109' },
  { n: 3, whenId: 'home.110', titleId: 'home.111', bodyId: 'home.112' },
  { n: 4, whenId: 'home.113', titleId: 'home.114', bodyId: 'home.115' },
  { n: 5, whenId: 'home.116', titleId: 'home.117', bodyId: 'home.118' },
] as const;
const SECTOR_CHIP_IDS = ['home.224', 'home.225', 'home.226', 'home.227'] as const;

/** "How it works" (design lines 616–703): the sticky intro + effort box + sector chips on the
 *  left, the five steps as the shared `ProcessSteps` (`plain`) on the right. `when` labels are
 *  resolved here (home.107 carries `{homepageReplyHours}` → `makeTf`). The chips are hidden at
 *  ≤ 460 px (`.ja-tl-chips`, W10). From 1101 the intro column is 0.75fr, so the step pills stay
 *  near their titles in the 1240 px box (W230). The intro sticks at `--sticky-top`, below the
 *  header at its real height (W232). */
export function ProcessSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const steps: ProcessStep[] = STEPS.map((step) => ({
    n: step.n,
    titleId: step.titleId,
    bodyId: step.bodyId,
    when: tf(step.whenId),
  }));
  return (
    <Section tone="light" id="process">
      <div
        data-testid="process"
        className="container-site grid items-start gap-[34px] lg:grid-cols-[0.42fr_1fr] lg:gap-14 xl:grid-cols-[0.75fr_1fr] xl:gap-[42px]"
      >
        <div className="min-w-0 lg:sticky lg:top-(--sticky-top) lg:self-start">
          <Eyebrow>{tf('home.091')}</Eyebrow>
          <h2 className="mb-4 mt-3.5 text-h2-process leading-[1.02] tracking-[-1.8px] max-xs:tracking-[-1px] xl:tracking-[-1.35px]">
            {tf('home.092')}
          </h2>
          <p className="m-0 mb-[18px] text-[15.5px] leading-[1.65] text-text-secondary xl:text-body">
            {tf('home.093')}
          </p>
          <div className="mb-5 rounded-base border border-tint-border bg-tint px-[18px] py-4">
            <p className="m-0 mb-1.5 text-[11px] font-extrabold uppercase tracking-[1.2px] text-blue-safe">
              {tf('home.094')}
            </p>
            <p className="m-0 text-body-sm font-bold leading-[1.55] text-ink">{tf('home.095')}</p>
          </div>
          <div className="flex flex-wrap gap-2 max-xs:hidden">
            {SECTOR_CHIP_IDS.map((id) => (
              <Link
                prefetch={false}
                key={id}
                href="/hire-workers"
                className="rounded-pill border border-border-1 bg-pale-1 px-[15px] py-[7px] text-[13px] font-bold text-[#43536a] no-underline hover:border-blue"
              >
                {tf(id)}
              </Link>
            ))}
          </div>
        </div>
        <ProcessSteps
          bundle={bundle}
          locale={locale}
          steps={steps}
          variant="plain"
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
