import { z } from 'zod';
import { makeTf } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import { LiveDot } from '../components/LiveDot';
import { rawRows } from '../lib/phase-a';
import type { SectionProps } from './types';

const StoryRow = z.object({ title: z.string().min(1) });

/**
 * The design's rotating "Approved" case bar (home.201 + six fabricated cases with synthetic refs
 * and "2h ago" recency). W6/D23: nothing renders until `stories` has signed rows; then Phase A
 * shows the newest title statically — the D9 v1 cards carry no recency, and a rotator needs a
 * pause control (D20); both belong to the Success Stories task. A row of another shape is skipped.
 */
export function LiveCaseBar({ locale, bundle }: SectionProps) {
  const first = StoryRow.safeParse(rawRows(bundle, 'stories')[0]);
  if (!first.success) return null;
  const tf = makeTf(bundle, locale);
  return (
    <div data-testid="live-case-bar" className="bg-ink text-white max-xs:bg-navy">
      <div className="container-site flex flex-wrap items-center gap-4 py-3.5 max-xs:flex-col max-xs:items-start max-xs:gap-1 max-xs:py-4">
        <span className="inline-flex shrink-0 items-center gap-2 text-[11px] font-extrabold uppercase tracking-[1.3px] text-[#5ddfb0]">
          <LiveDot />
          {tf('home.201')}
        </span>
        {/* the design's `.ja-tick`: the case line ticks in */}
        <span className="ja-tick min-w-0 text-body-sm font-bold">{first.data.title}</span>
        <Link
          prefetch={false}
          href="/success-stories"
          className="ml-auto whitespace-nowrap text-[13px] font-extrabold text-sky no-underline max-xs:ml-0"
        >
          {tf('home.055')}
        </Link>
      </div>
    </div>
  );
}
