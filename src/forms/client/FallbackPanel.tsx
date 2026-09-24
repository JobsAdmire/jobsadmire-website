'use client';
import { useEffect, useRef, type MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { FormKey } from '@/analytics/forms';
import { track } from '@/analytics/track';
import { Button } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { FormErrorResult } from '../types';

export type FallbackPanelProps = {
  result: FormErrorResult;
  values: Record<string, string>;
  formKey: FormKey;
  locale: Locale;
  whatsappNumber: string;
  /** first line of the WhatsApp prefill; defaults to `sys.form.fallback.whatsappIntro` */
  whatsappIntro?: string;
  contact?: { phone: string; phoneDisplay?: string; email: string };
  /** the panel heading's level — match the surrounding outline (axe `heading-order`); default 3 */
  headingLevel?: 2 | 3 | 4;
};

/** Kinds where the door cannot take the lead at all right now — WhatsApp is the primary action. */
const WHATSAPP_PRIMARY = new Set<FormErrorResult['kind']>([
  'tripped',
  'unavailable',
  'unauthorized',
  'off',
]);

/** The fields worth carrying into the WhatsApp message, in reading order. Anything else the
 *  page posted (consent, chips, hidden refs, object keys) stays out — the visitor is about to
 *  send this by hand. */
const WHATSAPP_FIELDS = [
  'name',
  'reporterName',
  'company',
  'email',
  'reporterEmail',
  'phone',
  'reporterPhone',
  'city',
  'country',
  'sector',
  'trade',
  'roleNeeded',
  'headcount',
  'startWhen',
  'preferredDate',
  'preferredTime',
  'subject',
  'topic',
  'description',
  'message',
] as const;

export function whatsappFallbackText(
  intro: string,
  values: Record<string, string>,
  label: (key: string) => string,
): string {
  const lines = [intro];
  for (const key of WHATSAPP_FIELDS) {
    const v = values[key]?.trim();
    if (v) lines.push(`${label(key)}: ${v}`);
  }
  return lines.join('\n');
}

/**
 * The D11 visitor-side fallback: never a spinner, never a fake success. Copy per result kind,
 * a WhatsApp chat prefilled — at click time, W76 — with what the visitor already typed
 * (primary when the door is closed/paused/unreachable, secondary when the visitor can fix and
 * resend), the phone and e-mail escape hatches, one `/api/form-beacon` ping per mount (so a
 * failing door shows on `/api/site-health` even with Sentry down — WP6 adds Sentry) and
 * `whatsapp_click` / `call_click` / `email_click` with `placement: 'form_fallback'` (W12).
 * Nothing typed ever reaches the beacon, the dataLayer or a DOM href.
 */
export function FallbackPanel({
  result,
  values,
  formKey,
  locale,
  whatsappNumber,
  whatsappIntro,
  contact,
  headingLevel = 3,
}: FallbackPanelProps) {
  const sys = useTranslations('sys');
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  // R35: the real URL, not next-intl's internal key.
  const page = usePathname() ?? '/';
  const kind = result.kind;
  const beaconed = useRef(false);
  useEffect(() => {
    // Once per mount: the shell keys this panel by `result.kind`, so a second failure of a
    // different kind re-mounts and re-pings while a re-render of the same one does not.
    if (beaconed.current) return;
    beaconed.current = true;
    try {
      navigator.sendBeacon?.('/api/form-beacon', JSON.stringify({ formKey, kind, page }));
    } catch {
      /* a blocked beacon must never break the panel */
    }
  }, [formKey, kind, page]);

  const primary = WHATSAPP_PRIMARY.has(kind);
  // W76 (D13): the prefilled text carries what the visitor typed, so it never sits in a DOM
  // href — GA4 enhanced-measurement outbound clicks and a GTM Click URL trigger both read the
  // href. The anchor points at the bare chat; the prefilled URL is composed on click and
  // opened directly (a modifier/middle click still reaches the bare chat).
  const openWhatsApp = (e: MouseEvent<HTMLElement>) => {
    track('whatsapp_click', { page, locale, placement: 'form_fallback' });
    e.preventDefault();
    const text = whatsappFallbackText(
      whatsappIntro ?? sys('form.fallback.whatsappIntro'),
      values,
      (k) => sys(`form.labels.${k}`),
    );
    window.open(waLink(whatsappNumber, text), '_blank', 'noopener');
  };
  const doorError = kind === 'failed' ? result.error : null;
  return (
    <div
      role="alert"
      data-testid="form-fallback"
      data-kind={kind}
      // the shell moves focus here after an error answer (D20)
      tabIndex={-1}
      className="mt-6 rounded-base border border-warning-border bg-warning-surface p-5 text-ink focus:outline-none"
    >
      <Heading className="m-0 text-body-lg font-extrabold">
        {sys(`form.fallback.${kind}.title`)}
      </Heading>
      <p className="mt-2 mb-0 text-body-sm text-text-secondary">
        {sys(`form.fallback.${kind}.body`)}
      </p>
      {doorError ? <p className="mt-2 mb-0 text-body-sm font-bold">{doorError}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant={primary ? 'primary' : 'secondary'}
          href={`https://wa.me/${whatsappNumber}`}
          external
          onClick={openWhatsApp}
        >
          {sys('form.fallback.whatsapp')}
        </Button>
        {contact ? (
          <>
            <Button
              variant="secondary"
              href={telLink(contact.phone)}
              onClick={() => track('call_click', { page, locale, placement: 'form_fallback' })}
            >
              {sys('form.fallback.call')}
            </Button>
            <Button
              variant="ghost"
              href={mailLink(contact.email)}
              onClick={() => track('email_click', { page, locale, placement: 'form_fallback' })}
            >
              {sys('form.fallback.email')}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
