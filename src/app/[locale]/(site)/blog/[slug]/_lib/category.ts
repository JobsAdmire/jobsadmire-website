import type { BlogCategory } from '@/content/collections';

/** The design's per-category colours (Blog Article `JA_BLOG_COVER` / `PILLS`, blog-posts.js 32–42):
 *  the cover gradient and the pill face. Pill text uses the contrast-safe step of each hue (D20:
 *  the design's #1899D5 / #7c3aed / #c2710c read under 4.5:1 on their tints). */
export const CATEGORY_LOOK: Record<
  BlogCategory,
  { from: string; to: string; pillBg: string; pillText: string }
> = {
  workPermits: { from: '#1899D5', to: '#0e5f8f', pillBg: '#e8f4fb', pillText: '#0e6aa0' },
  recruitment: { from: '#16a34a', to: '#0b6b2f', pillBg: '#eafaf1', pillText: '#12813c' },
  compliance: { from: '#7c3aed', to: '#4c1d95', pillBg: '#f3edfd', pillText: '#6d28d9' },
  marketNews: { from: '#f59e0b', to: '#b45309', pillBg: '#fef3e2', pillText: '#a5560a' },
};

export const coverGradient = (category: BlogCategory): string => {
  const { from, to } = CATEGORY_LOOK[category];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
};
