'use client';
import { PrintButton } from '@/design/islands/PrintButton';
import { ScrollSpyToc, type TocHeading } from '@/design/islands/ScrollSpyToc';
import { ShareRow, type ShareLabels } from '@/design/islands/ShareRow';
import { PRINT_CLASS, SHARE_CARD, SIDEBAR_STACK, TOC_CARD } from '../_lib/sidebar';

export type ArticleSidebarProps = {
  headings: TocHeading[];
  /** blogarticle.024 — the TOC's visible eyebrow and its landmark name. */
  tocLabel: string;
  readMinutes: number;
  /** "≈ {n} min left" — ScrollSpyToc's string props (W85): `{n}` is the literal token. */
  remaining: string;
  /** The article's absolute canonical URL (ShareRow: never a design literal). */
  url: string;
  title: string;
  share: ShareLabels;
  printLabel: string;
};

/**
 * B-13: the article sidebar as ONE lazy island — the scroll-spy TOC (the post's own read time,
 * W85 string props), the share row (W133 `copyFailed`) and the print button (B-16), loaded by
 * `ArticleSidebarIsland` when the sidebar nears the viewport. Its first render must stay
 * DOM-identical to `ArticleSidebarFallback` (`ArticleSidebar.test.tsx` compares the two).
 */
export function ArticleSidebar({
  headings,
  tocLabel,
  readMinutes,
  remaining,
  url,
  title,
  share,
  printLabel,
}: ArticleSidebarProps) {
  return (
    <div className={SIDEBAR_STACK}>
      <div className={TOC_CARD}>
        <ScrollSpyToc
          headings={headings}
          label={tocLabel}
          heading={tocLabel}
          readMinutes={readMinutes}
          remainingSingular={remaining}
          remainingPlural={remaining}
        />
      </div>
      <div className={SHARE_CARD} data-testid="article-share">
        <ShareRow url={url} title={title} labels={share} />
        <PrintButton label={printLabel} className={PRINT_CLASS} />
      </div>
    </div>
  );
}
