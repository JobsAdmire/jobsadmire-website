'use client';
import { useEffect } from 'react';
import { useIndexState } from './IndexState';

/**
 * The grid's client half (Blog.dc.html 650–668): it shows the first `visible` matching cards of
 * the server-rendered list `listId` — toggling each `li[data-post-key]`'s `hidden`, which the
 * server already set past the first page, so the first page (`PAGE_SIZE`, two rows of four —
 * W250) is visible before hydration — the no-results panel (blog.035) when no card matches, and
 * "Daha fazla yazı ↓" (blog.090) while more matches wait (a page more a click). The rows are
 * static RSC output React never re-renders on the client, so writing the attribute is safe; the
 * effect only writes the DOM (react-hooks 7).
 */
export function LoadMore({
  listId,
  moreLabel,
  noResultsLabel,
}: {
  listId: string;
  moreLabel: string;
  noResultsLabel: string;
}) {
  const { hits, visible, loadMore } = useIndexState();
  const signature = hits.slice(0, visible).join('|');

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const shown = new Set(signature ? signature.split('|') : []);
    for (const row of Array.from(list.querySelectorAll<HTMLElement>('[data-post-key]'))) {
      row.hidden = !shown.has(row.dataset.postKey ?? '');
    }
  }, [listId, signature]);

  return (
    <>
      {hits.length === 0 ? (
        <p
          data-testid="blog-no-results"
          className="mx-auto mt-7 mb-0 rounded-sm border border-dashed border-tint-border bg-pale-1 p-7 text-center text-[15px] font-semibold text-text-tertiary xl:text-[11.25px]"
        >
          {noResultsLabel}
        </p>
      ) : null}
      {hits.length > visible ? (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            data-testid="blog-load-more"
            aria-controls={listId}
            onClick={loadMore}
            className="ja-hover-lift inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[11px] border-[1.5px] border-blue bg-white px-8.5 py-3 text-[15px] font-extrabold text-blue-safe hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11.25px] max-md:min-h-[52px] max-md:w-full max-md:rounded-sm"
          >
            {moreLabel}
          </button>
        </div>
      ) : null}
    </>
  );
}
