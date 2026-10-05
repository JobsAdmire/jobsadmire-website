import { useTranslations } from 'next-intl';
import type { Story } from '../_lib/stories';

/** The hero's green live pill. The design summed headcounts and appended "live from CRM" /
 *  "sample data" (success.138–140) — wording that presumes a browser feed and must never
 *  render. Here: the ICU total only, and nothing at all while no approval is published. */
export function LiveBadge({ stories }: { stories: Story[] }) {
  const sys = useTranslations('sys');
  if (stories.length === 0) return null;
  const count = stories.reduce((n, s) => n + s.headcount, 0);
  return (
    <p
      data-testid="stories-live"
      className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-success/40 bg-success/10 px-4 py-1.5 text-body-sm font-extrabold text-success-surface"
    >
      <span aria-hidden="true" className="ja-live h-2 w-2 rounded-pill bg-success" />
      {sys('stories.hero.liveBadge', { count })}
    </p>
  );
}
