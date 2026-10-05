import { useTranslations } from 'next-intl';

/** The hero's green pill with the pulsing dot (design L452–454): the summed headcount of the
 *  approvals on the wall, through the ICU `sys.stories.hero.liveBadge` ("288 izin onaylandı").
 *  While the wall shows the design's sample approvals the design's own "· örnek veri" marker
 *  (`success.140`) follows it; the design's "· live from CRM" (`success.139`) presumes a browser
 *  feed and never renders. Nothing when the count is zero. */
export function LiveBadge({ count, sampleLabel }: { count: number; sampleLabel?: string }) {
  const sys = useTranslations('sys');
  if (count <= 0) return null;
  return (
    <p
      data-testid="stories-live"
      className="m-0 mb-5 inline-flex items-center gap-[0.5625rem] rounded-pill border border-[rgba(74,222,128,0.35)] bg-[rgba(74,222,128,0.12)] px-4 py-[0.4375rem] text-[12.5px] font-extrabold text-[#86efac] xl:text-[11px]"
    >
      <span aria-hidden="true" className="ja-live h-2 w-2 shrink-0 rounded-pill bg-success" />
      <span>
        {sys('stories.hero.liveBadge', { count })}
        {sampleLabel ? ` · ${sampleLabel}` : null}
      </span>
    </p>
  );
}
