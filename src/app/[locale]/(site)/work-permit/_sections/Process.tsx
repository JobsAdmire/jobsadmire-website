import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon, DocIcon, FileIcon, GlobeIcon, UserCheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { PROCESS_STEPS, type StepIcon } from '../_lib/tables';

const STEP_ICON: Record<StepIcon, typeof DocIcon> = {
  doc: DocIcon,
  globe: GlobeIcon,
  file: FileIcon,
  check: CheckIcon,
};

/** "How we get a permit approved": four steps (the last with the "SGK day one" badge) on a
 *  connector rail from 901 px — the design's reveal through the site-wide observer: once in view
 *  (`.ja-reveal-group`) the rail draws (`.ja-journey-line`) and the cards rise (`.ja-step`,
 *  src/design/motion/motion.css) — and the permit-only banner with its WhatsApp door.
 *  `ProcessSteps` has no badge slot and no horizontal variant, so this grid is page-local. */
export function Process({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const last = PROCESS_STEPS.length - 1;
  const [lead, rest] = [tf('wp.257'), tf('wp.258')];
  return (
    <Section tone="light">
      <div className="container-site" data-testid="wp-process">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
          {tf('wp.246')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-5 max-md:text-left">
          {tf('wp.247')}
        </p>
        <div className="ja-reveal-group relative">
          <span
            aria-hidden="true"
            className="ja-journey-line absolute top-[43px] right-10 left-10 h-[3px] rounded-pill bg-gradient-to-r from-blue via-blue-safe to-success max-lg:hidden"
          />
          <ol className="relative grid gap-6 max-md:gap-2.5 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = STEP_ICON[step.icon];
              const isLast = i === last;
              return (
                <li
                  key={step.titleId}
                  className={`ja-step min-w-0 rounded-md border bg-white px-6 py-6.5 max-md:px-3.5 max-md:py-3.5 ${isLast ? 'border-success-border' : 'border-border-2'}`}
                >
                  <div className="mb-4 flex items-center justify-between max-md:mb-2">
                    {/* D20: solid blue-safe / success-text dots — white on the design's
                        #1e9ee8 → #1073a8 and #22c55e → #15803d gradients falls below 4.5:1 */}
                    <span
                      aria-hidden="true"
                      className={`flex h-9.5 w-9.5 items-center justify-center rounded-pill text-body-sm font-extrabold text-white ${isLast ? 'bg-success-text' : 'bg-blue-safe'}`}
                    >
                      {i + 1}
                    </span>
                    <Icon size={22} className={isLast ? 'text-success' : 'text-[#8fb6cd]'} />
                  </div>
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-card-title">{tf(step.titleId)}</h3>
                    {step.badgeId ? (
                      <span className="rounded-pill border border-success-border bg-success-surface px-2.5 py-0.5 text-eyebrow font-extrabold tracking-[0.8px] text-success-text uppercase">
                        {tf(step.badgeId)}
                      </span>
                    ) : null}
                  </div>
                  <p className="m-0 text-body-sm text-text-secondary">{tf(step.bodyId)}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1080px] flex-wrap items-center justify-between gap-5 rounded-base border border-success-border bg-success-surface px-7 py-5.5 max-md:mt-5 max-md:flex-col max-md:items-stretch max-md:gap-3 max-md:px-4 max-md:py-4">
          <p className="m-0 flex min-w-0 flex-1 items-start gap-3.5 text-body text-[#14532d]">
            <UserCheckIcon size={20} className="mt-0.5 flex-none text-success-text" />
            <span>
              <strong className="font-extrabold text-ink">{lead}</strong>
              {sp(lead, rest)}
              {rest}
            </span>
          </p>
          <ContactCta
            placement="page_cta"
            variant="success"
            external
            href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'permitOnly'))}
          >
            {tf('wp.090')}
          </ContactCta>
        </div>
      </div>
    </Section>
  );
}
