import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Tf } from '../_lib/roles';

/** The seven steps (design `steps[]`): title / body / when, the "Admira AI" badge on steps 3–4.
 *  Badge faces clear 4.5:1 under white text (D20): `blue-safe` for the design's #1899D5,
 *  `success-text` for its #16a34a. The "when" labels are package copy rendered as authored
 *  (parity-baselined; listed for the WP-C copy review). */
const STEPS = [
  { title: 'jt.263', body: 'jt.264', when: 'jt.265', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.266', body: 'jt.267', when: 'jt.268', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.269', body: 'jt.270', when: 'jt.271', ai: true, badge: 'bg-[#253063]' },
  { title: 'jt.272', body: 'jt.273', when: 'jt.274', ai: true, badge: 'bg-[#253063]' },
  { title: 'jt.275', body: 'jt.276', when: 'jt.277', ai: false, badge: 'bg-[#253063]' },
  { title: 'jt.278', body: 'jt.279', when: 'jt.280', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.281', body: 'jt.282', when: 'jt.283', ai: false, badge: 'bg-success-text' },
] as const;

function StepList({ t }: { t: Tf }) {
  return (
    // The connector line sits beside the <ol>, never inside it: an <ol> holds <li>s only (axe `list`).
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute top-7 bottom-11 left-[25px] w-[3px] rounded-pill bg-[linear-gradient(180deg,#1899d5_0%,#253063_55%,#16a34a_100%)] opacity-25"
      />
      <ol className="relative flex flex-col">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[54px_1fr] gap-5 pb-6">
            <span
              aria-hidden="true"
              className={`flex h-[54px] w-[54px] items-center justify-center rounded-[17px] text-body-lg font-extrabold text-white ${s.badge}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="text-body-lg tracking-[-0.01em]">{t(s.title)}</h3>
                {s.ai && (
                  <span className="rounded-pill border border-[#ccd5ea] bg-[#edf1f9] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#253063]">
                    {t('jt.083')}
                  </span>
                )}
                <span className="text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-text-tertiary">
                  {t(s.when)}
                </span>
              </div>
              <p className="max-w-[640px] text-body-sm text-text-secondary">{t(s.body)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The hiring process (design `.ja-jt-process`) — `full` on the index; `compact` on the detail
 *  page (the steps under their own h2, no section header). "Check your application status"
 *  (`jt.085`) links to Operations and is not rendered (W89): the status link travels in the
 *  applicant's confirmation e-mail. */
export function HiringSteps({ t, variant = 'full' }: { t: Tf; variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div
        data-testid="careers-process"
        className="rounded-lg border border-border-2 bg-white p-6 md:p-8"
      >
        <h2 className="mb-6 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.081')}</h2>
        <StepList t={t} />
      </div>
    );
  }
  return (
    <Section tone="pale" className="border-t border-border-3">
      <div data-testid="careers-process" className="container-site">
        <div className="mb-8 max-w-[660px]">
          <Eyebrow>{t('jt.080')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.081')}</h2>
          <p className="text-body text-text-secondary">{t('jt.082')}</p>
        </div>
        <div className="rounded-lg border border-border-2 bg-white p-6 shadow-[0_10px_30px_rgba(22,60,90,0.06)] md:p-8">
          <StepList t={t} />
          <p className="mt-2 flex items-center gap-3 border-t border-border-3 pt-5 text-body-sm font-bold text-text-secondary">
            <span aria-hidden="true" className="h-2 w-2 flex-none rounded-pill bg-success" />
            {t('jt.084')}
          </p>
        </div>
      </div>
    </Section>
  );
}
