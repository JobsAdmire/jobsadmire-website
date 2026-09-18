import type { ReactNode } from 'react';

export function Section({
  tone,
  id,
  className,
  children,
}: {
  tone: 'light' | 'dark';
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const cls = ['py-16', tone === 'dark' ? 'bg-navy text-white' : 'bg-white text-ink', className]
    .filter(Boolean)
    .join(' ');
  return (
    <section id={id} className={cls}>
      {children}
    </section>
  );
}
