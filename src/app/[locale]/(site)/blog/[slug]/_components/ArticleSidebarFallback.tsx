import { remainingText, SHARE_CARD, SIDEBAR_STACK, TOC_CARD } from '../_lib/sidebar';
import type { ArticleSidebarProps } from './ArticleSidebar';
import { ShareView, TocView } from './SidebarView';

/** B-13: the sidebar's server HTML — a real TOC landmark and real share links before the island
 *  loads, and for good on a device that never scrolls to it. The island's own first render: the
 *  first heading current, the whole read time left, an empty status line. Both render
 *  `SidebarView`, so the LazyIsland swap never shifts the layout (W132). No directive, no hooks. */
export function ArticleSidebarFallback({
  headings,
  tocLabel,
  readMinutes,
  remaining,
  url,
  title,
  share,
  shareThis,
}: ArticleSidebarProps) {
  return (
    <div className={SIDEBAR_STACK}>
      <div className={TOC_CARD}>
        <TocView
          headings={headings}
          activeId={headings[0]?.id ?? ''}
          label={tocLabel}
          remaining={remainingText(readMinutes, remaining)}
        />
      </div>
      <div className={SHARE_CARD} data-testid="article-share">
        <ShareView url={url} title={title} labels={share} shareThis={shareThis} />
      </div>
    </div>
  );
}
