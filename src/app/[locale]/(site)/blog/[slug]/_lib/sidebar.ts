/**
 * Shared by the sidebar island (`ArticleSidebar`, client) and its server fallback
 * (`ArticleSidebarFallback`), so the LazyIsland swap is DOM-identical (W132, B-13). Pure
 * strings and one pure function — no imports. The markup itself lives in `SidebarView.tsx`
 * (hook-free, rendered by both), so the two can no longer drift.
 */
export const SIDEBAR_STACK = 'flex flex-col gap-[18px] xl:gap-[13.5px]';
/** Hidden on phones: the `<details>` TOC above the body replaces it there (B-12). */
export const TOC_CARD =
  'rounded-base border border-edge bg-white px-6 py-[22px] max-md:hidden xl:px-[18px] xl:py-[16.5px]';
export const SHARE_CARD =
  'rounded-base border border-edge bg-white px-6 py-[22px] xl:px-[18px] xl:py-[16.5px]';

/** ScrollSpyToc's first remaining-time line — its server snapshot, before any scroll: the
 *  whole read time left, `{n}` filled exactly as the island fills it. */
export function remainingText(readMinutes: number, template: string): string {
  return template.replace('{n}', String(Math.max(0, Math.ceil(readMinutes))));
}
