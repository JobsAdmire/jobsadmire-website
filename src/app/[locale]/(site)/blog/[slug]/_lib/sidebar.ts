/**
 * Shared by the sidebar island (`ArticleSidebar`, client) and its server fallback
 * (`ArticleSidebarFallback`), so the LazyIsland swap is DOM-identical (W132, B-13). Pure
 * strings and one pure function — no imports.
 */
export const SIDEBAR_STACK = 'flex flex-col gap-4';
/** Hidden on phones: the `<details>` TOC above the body replaces it there (B-12). */
export const TOC_CARD = 'rounded-base border border-border-1 bg-white p-5 max-md:hidden';
export const SHARE_CARD = 'rounded-base border border-border-1 bg-white p-5';
export const PRINT_CLASS = 'mt-3';

/** ScrollSpyToc's first remaining-time line — its server snapshot, before any scroll: the
 *  whole read time left, `{n}` filled exactly as the island fills it. */
export function remainingText(readMinutes: number, template: string): string {
  return template.replace('{n}', String(Math.max(0, Math.ceil(readMinutes))));
}
