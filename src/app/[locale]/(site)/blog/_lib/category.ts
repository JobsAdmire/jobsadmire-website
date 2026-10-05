import type { BlogCategory } from '@/content/collections';

/**
 * The design's per-category faces on the blog index (Blog.dc.html `COVERS` 949–954, the cards'
 * `catBg`/`catColor` in `postsEn` 895–917, the sheet's `CAT_DOT` ~1065; blog-posts.js 32–42):
 * the 135° cover gradient, the pill face and the topic dot. Whole Tailwind class strings — the
 * scanner only generates classes it finds whole in the source. The pill text is the
 * contrast-safe step of each hue (D20: the design's #1899D5 / #7c3aed / #c2710c read under 4.5:1
 * on their tints) — the same values as the article's `[slug]/_lib/category.ts`, so a card reads
 * the same on both routes (Shared request: one module for the two).
 */
export const CATEGORY_FACE: Record<BlogCategory, { cover: string; pill: string; dot: string }> = {
  workPermits: {
    cover: 'bg-[linear-gradient(135deg,#1899d5_0%,#0e5f8f_100%)]',
    pill: 'bg-tint text-[#0e6aa0]',
    dot: 'bg-blue',
  },
  recruitment: {
    cover: 'bg-[linear-gradient(135deg,#16a34a_0%,#0b6b2f_100%)]',
    pill: 'bg-success-soft text-success-text',
    dot: 'bg-success',
  },
  compliance: {
    cover: 'bg-[linear-gradient(135deg,#7c3aed_0%,#4c1d95_100%)]',
    pill: 'bg-[#f3edfd] text-[#6d28d9]',
    dot: 'bg-[#7c3aed]',
  },
  marketNews: {
    cover: 'bg-[linear-gradient(135deg,#f59e0b_0%,#b45309_100%)]',
    pill: 'bg-[#fef3e2] text-[#a5560a]',
    dot: 'bg-warning',
  },
};

/** The "All" row's dot in the phone topic sheet (the design's `CAT_DOT.All`, #16202e). */
export const ALL_DOT = 'bg-ink';
