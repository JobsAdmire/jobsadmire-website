'use client';
import type { MouseEvent, ReactNode } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { waLink } from '@/lib/contact';

/**
 * W95/W76 (D13): a WhatsApp CTA whose prefill carries what the visitor chose (the pass check's
 * answers). The DOM href is the bare chat, so neither GA4's outbound-click measurement nor a GTM
 * Click-URL trigger can read the prefill; the prefilled URL is composed on click and opened
 * `noopener` — the forms kernel's fallback-panel contract (and T1's composer, copied, not
 * imported: route folders never import each other). A middle click (no `click` event) reaches the
 * bare chat and is still counted. `whatsapp_click`, `placement: 'page_cta'` (W12).
 */
export function WhatsAppComposeLink({
  number,
  text,
  className,
  testId,
  children,
}: {
  number: string;
  text: string;
  className?: string;
  testId?: string;
  children: ReactNode;
}) {
  const fire = useContactClick('page_cta');
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    fire('whatsapp');
    e.preventDefault();
    window.open(waLink(number, text), '_blank', 'noopener');
  };
  const onAuxClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button === 1) fire('whatsapp');
  };
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      onClick={onClick}
      onAuxClick={onAuxClick}
      className={className}
    >
      {children}
    </a>
  );
}
