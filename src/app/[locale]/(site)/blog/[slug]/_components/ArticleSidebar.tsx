'use client';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { ShareLabels } from '@/design/islands/ShareRow';
import type { TocHeading } from '@/design/islands/ScrollSpyToc';
import { useScrollProgress } from '@/design/islands/useScrollProgress';
import { rootZoom } from '@/design/zoom';
import { SHARE_CARD, SIDEBAR_STACK, TOC_CARD } from '../_lib/sidebar';
import { ShareView, TocView } from './SidebarView';

export type ArticleSidebarProps = {
  headings: TocHeading[];
  /** blogarticle.024 — the TOC's visible eyebrow and its landmark name. */
  tocLabel: string;
  readMinutes: number;
  /** "≈ {n} min left" — the `{n}` token is filled here (W85 string props). */
  remaining: string;
  /** The article's absolute canonical URL (never a design literal). */
  url: string;
  title: string;
  share: ShareLabels;
  /** sys.blog.article.shareThis — the share card's phone eyebrow */
  shareThis: string;
};

/** Viewport offset below which a heading counts as reached (the sticky header's height). */
const OFFSET_PX = 96;

function subscribeScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/**
 * B-13: the article sidebar as ONE lazy island — the scroll-spy TOC (pill on the current entry,
 * the clock line counting the post's own read time down, W85) and the share card (three coloured
 * round links + Copy link; W133 `copyFailed`; no print, no native Share — neither is in the
 * design), loaded by `ArticleSidebarIsland` when the sidebar nears the viewport. Its first render
 * is DOM-identical to `ArticleSidebarFallback` (both render `SidebarView`;
 * `ArticleSidebar.test.tsx` compares the two).
 */
export function ArticleSidebar({
  headings,
  tocLabel,
  readMinutes,
  remaining,
  url,
  title,
  share,
  shareThis,
}: ArticleSidebarProps) {
  const first = headings[0]?.id ?? '';
  const getActive = useCallback(() => {
    let active = first;
    // the rect is in zoomed px on the liquid desktop, the offset in CSS px (W231)
    const line = OFFSET_PX * rootZoom();
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.getBoundingClientRect().top <= line) active = h.id;
    }
    return active;
  }, [headings, first]);
  const activeId = useSyncExternalStore(subscribeScroll, getActive, () => first);
  const progress = useScrollProgress();
  const minutesLeft = Math.max(0, Math.ceil(readMinutes * (1 - progress)));

  // The status line clears itself 2 s after the LATEST copy (W133): every copy stores a new
  // object, so this effect's cleanup cancels the previous timer and a fresh one starts.
  const [status, setStatus] = useState<{ text: string; failed: boolean; seq: number } | null>(null);
  useEffect(() => {
    if (!status) return;
    const id = window.setTimeout(() => setStatus(null), 2000);
    return () => window.clearTimeout(id);
  }, [status]);
  const announce = (text: string | undefined, failed: boolean) =>
    setStatus((prev) => (text ? { text, failed, seq: (prev?.seq ?? 0) + 1 } : null));
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      announce(share.copied, false);
    } catch {
      // Denied, an insecure context, or no Clipboard API at all (W133).
      announce(share.copyFailed, true);
    }
  };

  return (
    <div className={SIDEBAR_STACK}>
      <div className={TOC_CARD}>
        <TocView
          headings={headings}
          activeId={activeId}
          label={tocLabel}
          remaining={remaining.replace('{n}', String(minutesLeft))}
        />
      </div>
      <div className={SHARE_CARD} data-testid="article-share">
        <ShareView
          url={url}
          title={title}
          labels={share}
          shareThis={shareThis}
          status={status}
          onCopy={copy}
        />
      </div>
    </div>
  );
}
