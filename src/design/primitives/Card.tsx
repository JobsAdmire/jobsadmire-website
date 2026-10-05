import type { ReactNode } from 'react';

export function Card({
  hover = false,
  as = 'div',
  className,
  children,
}: {
  hover?: boolean;
  as?: 'article' | 'div';
  className?: string;
  children?: ReactNode;
}) {
  const Tag = as;
  const cls = [
    'rounded-xl border border-border-2 bg-white p-6 shadow-card',
    // the design's card hover (`.ja-card-l` / `.ja-ch`): a 3 px lift, a deeper shadow and the
    // tint edge — `ja-hover-card` in src/design/motion/motion.css (still under reduced motion)
    hover ? 'ja-hover-card' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <Tag className={cls}>{children}</Tag>;
}
