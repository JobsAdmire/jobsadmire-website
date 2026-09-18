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
    hover ? 'transition-shadow hover:shadow-card-hover' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <Tag className={cls}>{children}</Tag>;
}
