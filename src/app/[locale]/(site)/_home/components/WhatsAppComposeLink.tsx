'use client';
import type { MouseEvent, ReactNode } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { waLink } from '@/lib/contact';

/**
 * W95/W76 (D13): a WhatsApp CTA whose prefill carries what the visitor chose (the teaser's role,
 * headcount and figures). The DOM href is the bare chat, so neither GA4's outbound-click
 * measurement nor a GTM Click-URL trigger can read the prefill; the prefilled URL is composed on
 * click and opened `noopener` — the same contract as the forms kernel's fallback panel. A middle
 * click (no `click` event) reaches the bare chat and is still counted. Fires `whatsapp_click`
 * with `placement: 'page_cta'` like every page contact CTA (W12).
 */
export function WhatsAppComposeLink({
  number,
  text,
  className,
  children,
}: {
  number: string;
  text: string;
  className?: string;
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
      onClick={onClick}
      onAuxClick={onAuxClick}
      className={className}
    >
      {children}
    </a>
  );
}
