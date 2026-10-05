import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { SampleTag } from '@/design/blocks/SampleTag';
import { Link } from '@/i18n/navigation';
import { CaseTicker, type CaseLine } from '../components/CaseTicker';
import { LiveDot } from '../components/LiveDot';
import { SAMPLE_CASES } from '../lib/samples';
import type { SectionProps } from './types';

/**
 * The design's rotating "Approved" case bar (design ll. 446–457). Owner 2026-10-05: until
 * Operations publishes signed stories it shows the design's six sample cases (page-local
 * `SAMPLE_CASES`, package ids home.275–289 — never the `stories` collection, D23) with the
 * `SampleTag` beside the label. The strings resolve here; `CaseTicker` rotates them (4.5 s, the
 * `.ja-tick` slide-in, a Pause/Play toggle — D20). At ≤ 460 px the bar turns navy and stacks, the
 * approvals link becoming a full-width row over a hairline (`.ja-case`, W10).
 */
export function LiveCaseBar({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const cases: CaseLine[] = SAMPLE_CASES.map((c) => ({
    title: tf(c.titleId),
    sub: tf(c.subId),
    ref: c.ref,
    ago: 'id' in c.ago ? tf(c.ago.id) : sys('home.cases.daysAgo', { n: c.ago.days }),
  }));
  return (
    <div data-testid="live-case-bar" className="bg-ink text-white max-xs:bg-navy">
      <div className="container-site py-3.5 max-xs:py-4">
        <CaseTicker
          cases={cases}
          pauseLabel={sys('marquee.pause')}
          playLabel={sys('marquee.play')}
          label={
            <>
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[1.3px] text-mint">
                <LiveDot />
                {tf('home.201')}
              </span>
              <SampleTag tone="dark" />
            </>
          }
          link={
            <Link
              prefetch={false}
              href="/success-stories"
              className="ml-auto whitespace-nowrap text-[13px] font-extrabold text-sky no-underline hover:text-white max-xs:mt-2 max-xs:ml-0 max-xs:flex max-xs:min-h-[44px] max-xs:items-center max-xs:self-stretch max-xs:border-t max-xs:border-white/15 max-xs:pt-2.5 xl:text-[11px]"
            >
              {tf('home.055')}
            </Link>
          }
        />
      </div>
    </div>
  );
}
